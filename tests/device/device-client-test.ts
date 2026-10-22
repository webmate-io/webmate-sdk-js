import 'mocha';
import {assert} from 'chai';
import * as http from "http";
import {AddressInfo} from "net";
import {of} from "rxjs";
import {DeviceClient} from "../../src/device/device-client";
import {WebmateAPISession} from "../../src/webmate-api-session";
import {WebmateAuthInfo} from "../../src/webmate-auth-info";
import {WebmateEnvironment} from "../../src/webmate-environment";

describe('Device Client Tests', function() {

    const deviceId = 'b0f5b1a2-0000-4000-8000-000000000001';
    const packageId = 'b0f5b1a2-0000-4000-8000-000000000002';
    const origPackageId = 'b0f5b1a2-0000-4000-8000-000000000003';
    const instrumentedPackageId = 'b0f5b1a2-0000-4000-8000-000000000004';

    const installationId = 'b0f5b1a2-0000-4000-8000-000000000005';

    /**
     * Creates a client whose device reports the given installed packages, one list per device lookup (the last one is
     * repeated). Polling is sped up so that waiting tests run quickly.
     */
    function makeClient(appPackage: any, ...installed: any[][]): {client: DeviceClient, requirements: any[], lookups: () => number} {
        const session = new WebmateAPISession(new WebmateAuthInfo('token'), new WebmateEnvironment());
        (session as any).packages = {getPackage: () => of(appPackage)};
        const client = new DeviceClient(session);
        (client as any).INSTALL_WAITING_POLLING_INTERVAL_MILLIS = 1;
        (client as any).MAX_INSTALL_WAITING_TIME_MILLIS = 20;
        const requirements: any[] = [];
        let lookups = 0;
        (client as any).apiClient = {
            installAppOnDevice: (id: string, pkgId: string, pkgType: string) => {
                requirements.push({deviceId: id, packageId: pkgId, packageType: pkgType});
                return of(installationId);
            },
            getDeviceInfo: () => of({properties: {'package.installedPackages': installed[Math.min(lookups++, installed.length - 1)]}}),
        };
        return {client, requirements, lookups: () => lookups};
    }

    const appPackage = {id: packageId, origPackageId: origPackageId, origPackageType: 'apk'};
    const previousInstallation = {installationId: 'b0f5b1a2-0000-4000-8000-000000000006', packageId: origPackageId, state: 'finished'};

    it('should install the original package of the package document', async function() {
        const {client, requirements} = makeClient(
            appPackage,
            [{installationId: installationId, packageId: origPackageId, state: 'finished'}]);

        await client.installAppOnDevice(deviceId, packageId).toPromise();

        assert.deepEqual(requirements, [{deviceId: deviceId, packageId: origPackageId, packageType: 'apk'}]);
    });

    it('should install the instrumented package if requested', async function() {
        const {client, requirements} = makeClient(
            {id: packageId, origPackageId: origPackageId, origPackageType: 'apk',
                instrumentedPackageId: instrumentedPackageId, instrumentedPackageType: 'apk'},
            [{installationId: installationId, packageId: instrumentedPackageId, state: 'finished'}]);

        await client.installAppOnDevice(deviceId, packageId, true).toPromise();

        assert.deepEqual(requirements, [{deviceId: deviceId, packageId: instrumentedPackageId, packageType: 'apk'}]);
    });

    it('should wait until the requested installation is finished', async function() {
        const {client, lookups} = makeClient(appPackage,
            [],
            [{installationId: installationId, packageId: origPackageId, state: 'requested'}],
            [{installationId: installationId, packageId: origPackageId, state: 'finished'}]);

        await client.installAppOnDevice(deviceId, packageId).toPromise();

        assert.equal(lookups(), 3);
    });

    it('should not mistake a previous installation of the same package for the requested one', async function() {
        const {client, lookups} = makeClient(appPackage,
            [previousInstallation],
            [previousInstallation, {installationId: installationId, packageId: origPackageId, state: 'requested'}],
            [previousInstallation, {installationId: installationId, packageId: origPackageId, state: 'finished'}]);

        await client.installAppOnDevice(deviceId, packageId).toPromise();

        assert.equal(lookups(), 3);
    });

    it('should fail without further polling if the device reports the installation as failed', async function() {
        const {client, lookups} = makeClient(appPackage,
            [{installationId: installationId, packageId: origPackageId, state: 'failed'}]);

        try {
            await client.installAppOnDevice(deviceId, packageId).toPromise();
            assert.fail('Expected the failed installation to be reported');
        } catch (e) {
            assert.include((e as Error).message, 'failed');
        }
        assert.equal(lookups(), 1);
    });

    it('should fail if the installation does not finish in time', async function() {
        const {client} = makeClient(appPackage,
            [{installationId: installationId, packageId: origPackageId, state: 'requested'}]);

        try {
            await client.installAppOnDevice(deviceId, packageId).toPromise();
            assert.fail('Expected a timeout');
        } catch (e) {
            assert.include((e as Error).message, 'was not installed');
        }
    });

    it('should reset the device instead of releasing it', async function() {
        const requests: {method?: string, url?: string}[] = [];
        const server = http.createServer((req, res) => {
            requests.push({method: req.method, url: req.url});
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end('{}');
        });
        await new Promise<void>(resolve => server.listen(0, 'localhost', () => resolve()));
        try {
            const port = (server.address() as AddressInfo).port;
            const session = new WebmateAPISession(new WebmateAuthInfo('token'), new WebmateEnvironment(`http://localhost:${port}/api/v1`));

            await session.device.resetDevice(deviceId).toPromise();

            assert.deepEqual(requests, [{method: 'POST', url: `/api/v1/device/devices/${deviceId}/reset`}]);
        } finally {
            await new Promise<void>(resolve => server.close(() => resolve()));
        }
    });
});
