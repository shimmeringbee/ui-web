import { useAppDispatch } from '../app/hooks';
import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import {
    ConnectionState,
    removeDevice,
    removeZone,
    updateConnectionState,
    updateDevice,
    updateDeviceCapability,
    updateGateway,
    updateLastMessage,
    updateZone,
} from '../features/controller/controller-slice';
import type {
    DeviceRemoveMessage,
    DeviceUpdateCapabilityMessage,
    DeviceUpdateMessage,
    GatewayUpdateMessage,
    ZoneRemoveMessage,
    ZoneUpdateMessage,
} from '../features/controller/messages';

interface ControllerProps {
    url: string;
}

export const Controller: FC<ControllerProps> = (props) => {
    const dispatch = useAppDispatch();
    const eventSource = useRef<EventSource | null>(null);

    useEffect(() => {
        if (eventSource.current !== null) {
            return;
        }

        eventSource.current = new EventSource(props.url);
        dispatch(updateConnectionState(ConnectionState.Connecting));

        eventSource.current.addEventListener('HeartBeat', () => {
            dispatch(updateLastMessage());
        });

        eventSource.current.addEventListener('ZoneUpdate', (e: MessageEvent<string>) => {
            dispatch(updateLastMessage());
            dispatch(updateZone(JSON.parse(e.data) as ZoneUpdateMessage));
        });

        eventSource.current.addEventListener('ZoneRemove', (e: MessageEvent<string>) => {
            dispatch(updateLastMessage());
            dispatch(removeZone(JSON.parse(e.data) as ZoneRemoveMessage));
        });

        eventSource.current.addEventListener('GatewayUpdate', (e: MessageEvent<string>) => {
            dispatch(updateLastMessage());
            dispatch(updateGateway(JSON.parse(e.data) as GatewayUpdateMessage));
        });

        eventSource.current.addEventListener('DeviceUpdate', (e: MessageEvent<string>) => {
            dispatch(updateLastMessage());
            dispatch(updateDevice(JSON.parse(e.data) as DeviceUpdateMessage));
        });

        eventSource.current.addEventListener('DeviceUpdateCapability', (e: MessageEvent<string>) => {
            dispatch(updateLastMessage());
            dispatch(updateDeviceCapability(JSON.parse(e.data) as DeviceUpdateCapabilityMessage));
        });

        eventSource.current.addEventListener('DeviceRemove', (e: MessageEvent<string>) => {
            dispatch(updateLastMessage());
            dispatch(removeDevice(JSON.parse(e.data) as DeviceRemoveMessage));
        });

        eventSource.current.addEventListener('open', () => {
            dispatch(updateConnectionState(ConnectionState.Connected));
        });

        eventSource.current.addEventListener('error', () => {
            dispatch(updateConnectionState(ConnectionState.Closed));
        });

        return () => {
            if (eventSource.current === null) {
                return;
            }

            eventSource.current.onmessage = null;
            eventSource.current.close();
            eventSource.current = null;

            dispatch(updateConnectionState(ConnectionState.Closed));
        };
    }, [props.url]);

    return false;
};
