export const ProductInformationName = 'ProductInformation';

export interface ProductInformation {
    Name?: string;
    Manufacturer?: string;
    Serial?: string;
    Version?: string;
}

export const EnumerateDeviceName = 'EnumerateDevice';

interface EnumerateCapability {
    Attached: boolean;
    Errors: string[];
}

export interface EnumerateDevice {
    Enumerating: boolean;
    Status: { [capability: string]: EnumerateCapability };
}

export const DeviceRemovalName = 'DeviceRemoval';

export interface DeviceRemoval {}

export const DeviceDiscoveryName = 'DeviceDiscovery';

export interface DeviceDiscovery {
    Discovering: boolean;
    Duration: number;
}

export const IdentifyName = 'Identify';

export interface Identify {
    Identifying: boolean;
    Duration?: number;
}
