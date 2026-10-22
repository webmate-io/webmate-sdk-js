import 'mocha';
import {assert} from 'chai';
import * as http from "http";
import {AddressInfo} from "net";
import {WebmateAPISession} from "../../src/webmate-api-session";
import {WebmateAuthInfo} from "../../src/webmate-auth-info";
import {WebmateEnvironment} from "../../src/webmate-environment";

describe('Package Management Client Tests', function() {

    const packageId = 'b0f5b1a2-0000-4000-8000-000000000002';

    let server: http.Server;
    let requests: {method?: string, url?: string, apiToken?: string | string[]}[];
    let session: WebmateAPISession;

    beforeEach(async function() {
        requests = [];
        server = http.createServer((req, res) => {
            requests.push({method: req.method, url: req.url, apiToken: req.headers['webmate.api-token']});
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end('{}');
        });
        await new Promise<void>(resolve => server.listen(0, 'localhost', () => resolve()));
        const port = (server.address() as AddressInfo).port;
        session = new WebmateAPISession(new WebmateAuthInfo('token'), new WebmateEnvironment(`http://localhost:${port}/api/v1`));
    });

    afterEach(function(done) {
        server.close(() => done());
    });

    it('should delete the package', async function() {
        await session.packages.deletePackage(packageId).toPromise();

        assert.deepEqual(requests, [{method: 'DELETE', url: `/api/v1/package/packages/${packageId}`, apiToken: 'token'}]);
    });
});
