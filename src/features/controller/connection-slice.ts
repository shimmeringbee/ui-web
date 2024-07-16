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
import { MoveDeviceToZone, NameDevice } from './payloads';
import { RootState } from '../../app/store';
import axios, { AxiosResponse } from 'axios';


export enum ConnectionProgress {
    Idle,
    Connecting,
    Connected,
    Closed,
}

interface ConnectionState {
    url: string;
    progress: ConnectionProgress;
    lastMessage: number;
}


const initialState: ConnectionState = {
    url: '',
    progress: ConnectionProgress.Idle,
    lastMessage: 0,
};

const connectionSlice = createAppSlice({
    name: 'connection',
    initialState,
    reducers: (create) => ({
        updateConnectionUrl: create.reducer((state, action: PayloadAction<string>) => {
            state.url = action.payload;
        }),
        updateConnectionState: create.reducer((state, action: PayloadAction<ConnectionProgress>) => {
            state.progress = action.payload;
        }),
        updateLastMessage: create.reducer((state) => {
            state.lastMessage = Date.now();
        }),
    }),
});

export const {
    updateConnectionUrl,
    updateConnectionState,
    updateLastMessage,
} = connectionSlice.actions;
export default connectionSlice;
