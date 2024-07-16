export interface ProductInformation {
    Name?: string;
    Manufacturer?: string;
    Serial?: string;
    Version?: string;
}

interface EnumerateCapability {
    Attached: boolean;
    Errors: string[];
}

export interface EnumerateDevice {
    Enumerating: boolean;
    Status: { [capability: string]: EnumerateCapability };
}

export interface DeviceRemoval {}

export interface DeviceDiscovery {
    Discovering: boolean;
    Duration: number;
}

export interface Identify {
    Identifying: boolean;
    Duration?: number;
}

export const ProductInformationName = 'ProductInformation';
export const EnumerateDeviceName = 'EnumerateDevice';
export const DeviceRemovalName = 'DeviceRemoval';
export const DeviceDiscoveryName = 'DeviceDiscovery';
export const IdentifyName = 'Identify';
export const PowerSupplyName = 'PowerSupply';
export const ConnectivityName = 'Connectivity';
export const DeviceAlarmsName = 'DeviceAlarms';
export const OnOffName = 'OnOff';
export const LightName = 'Light';
export const CoverName = 'Cover';
export const BasicHumanInterfaceDeviceName = 'BasicHumanInterfaceDevice';
export const TemperatureSensorName = 'TemperatureSensor';
export const RelativeHumiditySensorName = 'RelativeHumiditySensor';
export const PressureSensorName = 'PressureSensor';
export const OccupancySensorName = 'OccupancySensor';
export const IllustrationSensorName = 'IllustrationSensor';
export const EnergySensorName = 'EnergySensor';
export const AlarmsSensorName = 'AlarmsSensor';
export const AlarmWarningDeviceName = 'AlarmWarningDevice';
export const LocalDebugName = 'LocalDebug';
export const RemoteDebugName = 'RemoteDebug';
export const DeviceWorkaroundsName = 'DeviceWorkarounds';
