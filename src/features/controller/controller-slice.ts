import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    DeviceRemoveMessage,
    DeviceUpdateCapabilityMessage,
    DeviceUpdateMessage,
    GatewayUpdateMessage,
    ZoneRemoveMessage,
    ZoneUpdateMessage,
} from './messages';

interface Device {
    identifier: string;
    name?: string;
    zones: number[];
    gateway: string;
    capabilities: { [name: string]: any };
}

interface Zone {
    identifier: number;
    name?: string;
    parentZone: number;
    subZones: number[];
    devices: string[];
}

interface Gateway {
    identifier: string;
    capabilities: string[];
    selfDevice: string;
    devices: string[];
}

export enum ConnectionState {
    Idle,
    Connecting,
    Connected,
    Closed,
}

interface ControllerState {
    connectionState: ConnectionState;
    lastMessage: number;
    devices: { [identifier: string]: Device };
    zones: { [identifier: number]: Zone };
    gateways: { [identifier: string]: Gateway };
}

const RootZone: number = 0;

const initialState: ControllerState = {
    connectionState: ConnectionState.Idle,
    lastMessage: 0,
    devices: {},
    zones: {
        0: {
            name: 'Hidden Root',
            identifier: RootZone,
            parentZone: RootZone,
            subZones: [],
            devices: [],
        },
    },
    gateways: {},
};

const controllerSlice = createSlice({
    name: 'controller',
    initialState,
    reducers: {
        updateConnectionState(state, action: PayloadAction<ConnectionState>) {
            state.connectionState = action.payload;
        },
        updateLastMessage(state) {
            state.lastMessage = Date.now();
        },
        updateZone(state, action: PayloadAction<ZoneUpdateMessage>) {
            let msg = action.payload;
            let zoneId = msg.Identifier;
            let newParent = msg.Parent;

            if (!(zoneId in state.zones)) {
                state.zones[zoneId] = {
                    identifier: zoneId,
                    name: msg.Name,
                    parentZone: RootZone,
                    subZones: [],
                    devices: [],
                };

                state.zones[RootZone].subZones.push(zoneId);
            }

            if (msg.Parent !== state.zones[zoneId].parentZone) {
                let oldParent = state.zones[zoneId].parentZone;

                state.zones[oldParent].subZones = state.zones[oldParent].subZones.filter((zone) => zone != zoneId);
                state.zones[newParent].subZones.push(zoneId);
                state.zones[zoneId].parentZone = newParent;
            }

            state.zones[newParent].subZones = state.zones[newParent].subZones.filter((zone) => zone != zoneId);

            let afterIndex = 0;

            if (msg.After !== 0) {
                let afterIndex = state.zones[newParent].subZones.indexOf(msg.After);
            }

            state.zones[newParent].subZones = state.zones[newParent].subZones.toSpliced(afterIndex, 0, zoneId);
        },
        removeZone(state, action: PayloadAction<ZoneRemoveMessage>) {
            let removeId = action.payload.Identifier;

            if (!(removeId in state.gateways)) {
                return;
            }

            let zone = state.zones[removeId];

            zone.devices.forEach((deviceId) => {
                state.devices[deviceId].zones = state.devices[deviceId].zones.filter((zone) => zone != removeId);
            });

            state.zones[zone.parentZone].subZones = state.zones[zone.parentZone].subZones.filter(
                (subZone) => subZone != removeId
            );
        },
        updateGateway(state, action: PayloadAction<GatewayUpdateMessage>) {
            let msg = action.payload;

            if (msg.Identifier! in state.gateways) {
                state.gateways[msg.Identifier].capabilities = msg.Capabilities;
                state.gateways[msg.Identifier].selfDevice = msg.SelfDevice;
            } else {
                state.gateways[msg.Identifier] = {
                    identifier: msg.Identifier,
                    capabilities: msg.Capabilities,
                    selfDevice: msg.SelfDevice,
                    devices: [],
                };
            }
        },
        updateDevice(state, action: PayloadAction<DeviceUpdateMessage>) {
            let deviceId = action.payload.Identifier;

            if (!(deviceId in state.devices)) {
                state.devices[deviceId] = {
                    identifier: deviceId,
                    gateway: action.payload.Gateway,
                    capabilities: {},
                    zones: [],
                };
            }

            if (action.payload.Metadata.Name) {
                state.devices[deviceId].name = action.payload.Metadata.Name;
            }

            let newZones = (action.payload.Metadata.Zones || []).filter((zone) => !state.devices[deviceId].zones.includes(zone));
            let removeZones = state.devices[deviceId].zones.filter((zone) => !(action.payload.Metadata.Zones || []).includes(zone));

            newZones.forEach((zone) => {
                state.devices[deviceId].zones.push(zone);
                state.zones[zone].devices.push(deviceId);
            });

            removeZones.forEach((zone) => {
                state.devices[deviceId].zones = state.devices[deviceId].zones.filter((czone) => zone !== czone);
                state.zones[zone].devices = state.zones[zone].devices.filter((id) => id !== deviceId);
            });
        },
        updateDeviceCapability(state, action: PayloadAction<DeviceUpdateCapabilityMessage>) {
            let deviceId = action.payload.Identifier;

            if (!(deviceId in state.devices)) {
                return;
            }

            state.devices[deviceId].capabilities[action.payload.Capability] = action.payload.Payload;
        },
        removeDevice(state, action: PayloadAction<DeviceRemoveMessage>) {
            let removeId = action.payload.Identifier;

            if (!(removeId in state.devices)) {
                return;
            }

            let oldDevice = state.devices[removeId];
            delete state.devices[removeId];

            oldDevice.zones.forEach((zone) => {
                state.zones[zone].devices = state.zones[zone].devices.filter((device) => device !== removeId);
            });
        },
    },
});

export const {
    updateConnectionState,
    updateLastMessage,
    updateZone,
    removeZone,
    updateGateway,
    updateDevice,
    updateDeviceCapability,
    removeDevice,
} = controllerSlice.actions;
export default controllerSlice;
