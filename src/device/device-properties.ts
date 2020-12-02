import {Map} from 'immutable';

export type DevicePropertyName = string;
export type DeviceProperties = Map<DevicePropertyName, any>;
export type DeviceRequirements = DeviceProperties;

export const DevicePropertyNames = {
    AutomationEnabled: 'automation.available',
    Console: 'console.interactive',
    Resolution: 'console.resolution',
    ChangeResolution: 'console.changeResolution',
    SlotId: 'webmate.slotId',
    ProviderType: 'webmate.providerType',
    OpenSTFSerial: 'openstf.serial',
    VCloudTemplateId: 'vcloud.templateId',
    Locale: 'os.locale',
    Unavailable: 'webmate.deviceUnavailable',
    ModelName: 'machine.model',
    ManufacturerName: 'machine.manufacturer'
};
