interface ZoneMessage {
    Identifier: number;
}

export interface ZoneUpdateMessage extends ZoneMessage {
    Name: string;
    Parent: number;
    After: number;
}

export interface ZoneRemoveMessage extends ZoneMessage {}

export interface GatewayUpdateMessage {
    Identifier: string;
    Capabilities: string[];
    SelfDevice: string;
}

interface DeviceMessage {
    Identifier: string;
}

interface DeviceMetadata {
    Name?: string;
    Zones?: number[];
}

export interface DeviceUpdateMessage extends DeviceMessage {
    Metadata: DeviceMetadata;
    Capabilities: string[];
    Gateway: string;
}

export interface DeviceUpdateCapabilityMessage extends DeviceMessage {
    Capability: string;
    Payload: any;
}

export interface DeviceRemoveMessage extends DeviceMessage {}
