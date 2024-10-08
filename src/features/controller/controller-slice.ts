import type { PayloadAction } from '@reduxjs/toolkit';
import type {
    DeviceRemoveMessage,
    DeviceUpdateCapabilityMessage,
    DeviceUpdateMessage,
    GatewayUpdateMessage,
    ZoneRemoveMessage,
    ZoneUpdateMessage,
} from './messages';
import { createAppSlice } from '../../app/createAppSlice';
import { MoveDeviceToZone, NameDevice, NameZone } from './payloads';
import { RootState } from '../../app/store';
import axios, { AxiosResponse } from 'axios';

export enum OperationState {
    IDLE,
    IN_PROGRESS,
    COMPLETE,
    FAILED,
}

export interface Operation {
    inflight: number;
    state: OperationState;
}

export interface UIState {
    operations: { [operation: string]: Operation };
}

export interface Device {
    identifier: string;
    name?: string;
    zones: number[];
    gateway: string;
    capabilities: { [name: string]: any };
}

export interface Zone {
    identifier: number;
    name?: string;
    parentZone: number;
    subZones: number[];
    devices: string[];
}

export interface Gateway {
    identifier: string;
    capabilities: string[];
    selfDevice: string;
    devices: string[];
}

interface ControllerState {
    devices: { [identifier: string]: Device };
    zones: { [identifier: number]: Zone };
    gateways: { [identifier: string]: Gateway };
}

export const RootZone: number = 0;

const initialState: ControllerState = {
    devices: {},
    zones: {
        0: {
            name: 'Root',
            identifier: RootZone,
            parentZone: RootZone,
            subZones: [],
            devices: [],
        },
    },
    gateways: {},
};

const controllerSlice = createAppSlice({
    name: 'controller',
    initialState,
    reducers: (create) => ({
        updateZone: create.reducer((state, action: PayloadAction<ZoneUpdateMessage>) => {
            let msg = action.payload;
            let zoneId = msg.Identifier;
            let newParent = msg.Parent;

            if (!(zoneId in state.zones)) {
                state.zones[zoneId] = {
                    identifier: zoneId,
                    parentZone: RootZone,
                    subZones: [],
                    devices: [],
                };

                state.zones[RootZone].subZones.push(zoneId);
            }

            state.zones[zoneId].name = msg.Name;

            if (msg.Parent !== state.zones[zoneId].parentZone) {
                let oldParent = state.zones[zoneId].parentZone;

                state.zones[oldParent].subZones = state.zones[oldParent].subZones.filter((zone) => zone !== zoneId);
                state.zones[newParent].subZones.push(zoneId);
                state.zones[zoneId].parentZone = newParent;
            }

            state.zones[newParent].subZones = state.zones[newParent].subZones.filter((zone) => zone !== zoneId);

            let afterIndex = 0;

            if (msg.After !== 0) {
                afterIndex = state.zones[newParent].subZones.indexOf(msg.After) + 1;
            }

            state.zones[newParent].subZones = state.zones[newParent].subZones.toSpliced(afterIndex, 0, zoneId);
        }),
        removeZone: create.reducer((state, action: PayloadAction<ZoneRemoveMessage>) => {
            let removeId = action.payload.Identifier;

            if (!(removeId in state.gateways)) {
                return;
            }

            let zone = state.zones[removeId];

            zone.devices.forEach((deviceId) => {
                state.devices[deviceId].zones = state.devices[deviceId].zones.filter((zone) => zone !== removeId);
            });

            state.zones[zone.parentZone].subZones = state.zones[zone.parentZone].subZones.filter(
                (subZone) => subZone !== removeId
            );
        }),
        updateGateway: create.reducer((state, action: PayloadAction<GatewayUpdateMessage>) => {
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
        }),
        updateDevice: create.reducer((state, action: PayloadAction<DeviceUpdateMessage>) => {
            let deviceId = action.payload.Identifier;

            if (!(deviceId in state.devices)) {
                state.devices[deviceId] = {
                    identifier: deviceId,
                    gateway: action.payload.Gateway,
                    capabilities: {},
                    zones: [],
                };
            }

            state.devices[deviceId].name = action.payload.Metadata.Name;

            let newZones = (action.payload.Metadata.Zones || []).filter(
                (zone) => !state.devices[deviceId].zones.includes(zone)
            );
            let removeZones = state.devices[deviceId].zones.filter(
                (zone) => !(action.payload.Metadata.Zones || []).includes(zone)
            );

            newZones.forEach((zone) => {
                state.devices[deviceId].zones.push(zone);
                state.zones[zone].devices.push(deviceId);
            });

            removeZones.forEach((zone) => {
                state.devices[deviceId].zones = state.devices[deviceId].zones.filter((czone) => zone !== czone);
                state.zones[zone].devices = state.zones[zone].devices.filter((id) => id !== deviceId);
            });
        }),
        updateDeviceCapability: create.reducer((state, action: PayloadAction<DeviceUpdateCapabilityMessage>) => {
            let deviceId = action.payload.Identifier;

            if (!(deviceId in state.devices)) {
                return;
            }

            state.devices[deviceId].capabilities[action.payload.Capability] = action.payload.Payload;
        }),
        removeDevice: create.reducer((state, action: PayloadAction<DeviceRemoveMessage>) => {
            let removeId = action.payload.Identifier;

            if (!(removeId in state.devices)) {
                return;
            }

            let oldDevice = state.devices[removeId];
            delete state.devices[removeId];

            oldDevice.zones.forEach((zone) => {
                state.zones[zone].devices = state.zones[zone].devices.filter((device) => device !== removeId);
            });
        }),
        requestAddDeviceToZone: create.asyncThunk(
            async (payload: MoveDeviceToZone, thunkApi): Promise<AxiosResponse<any>[]> => {
                const controllerState = (thunkApi.getState() as RootState).controller;
                const connectionState = (thunkApi.getState() as RootState).connection;

                let device = controllerState.devices[payload.deviceId];

                let promises = device.zones.map((zoneId) => {
                    let url = `${connectionState.url}/api/v1/zones/${zoneId}/devices/${payload.deviceId}`;
                    return axios.delete(url);
                });

                if (!device.zones.includes(payload.zoneId) && payload.zoneId !== RootZone) {
                    let url = `${connectionState.url}/api/v1/zones/${payload.zoneId}/devices/${payload.deviceId}`;
                    promises.push(axios.put(url));
                }

                return Promise.all(promises);
            },
            {
                pending: (state, action) => {},
                fulfilled: (state, action) => {},
                rejected: (state, action) => {},
            }
        ),
        requestNameDevice: create.asyncThunk(
            async (payload: NameDevice, thunkApi): Promise<AxiosResponse<any>[]> => {
                const connectionState = (thunkApi.getState() as RootState).connection;

                let url = `${connectionState.url}/api/v1/devices/${payload.deviceId}`;
                return axios.patch(url, { name: payload.name });
            },
            {
                pending: (state, action) => {},
                fulfilled: (state, action) => {},
                rejected: (state, action) => {},
            }
        ),
        requestNameZone: create.asyncThunk(
            async (payload: NameZone, thunkApi): Promise<AxiosResponse<any>[]> => {
                const connectionState = (thunkApi.getState() as RootState).connection;

                let url = `${connectionState.url}/api/v1/zones/${payload.zoneId}`;
                return axios.patch(url, { name: payload.name });
            },
            {
                pending: (state, action) => {},
                fulfilled: (state, action) => {},
                rejected: (state, action) => {},
            }
        ),
    }),
});

export const {
    updateZone,
    removeZone,
    updateGateway,
    updateDevice,
    updateDeviceCapability,
    removeDevice,
    requestAddDeviceToZone,
    requestNameDevice,
    requestNameZone,
} = controllerSlice.actions;
export default controllerSlice;
