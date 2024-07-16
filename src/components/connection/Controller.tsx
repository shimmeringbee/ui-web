import { useAppDispatch, useAppSelector } from '../../app/hooks';
import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import {
    removeDevice,
    removeZone,
    updateDevice,
    updateDeviceCapability,
    updateGateway,
    updateZone,
} from '../../features/controller/controller-slice';
import type {
    DeviceRemoveMessage,
    DeviceUpdateCapabilityMessage,
    DeviceUpdateMessage,
    GatewayUpdateMessage,
    ZoneRemoveMessage,
    ZoneUpdateMessage,
} from '../../features/controller/messages';
import {
    ConnectionProgress,
    updateConnectionState,
    updateLastMessage,
} from '../../features/controller/connection-slice';

export const Controller = () => {
    const dispatch = useAppDispatch();
    const eventSource = useRef<EventSource | null>(null);

    const urlBase = useAppSelector((state) => state.connection.url);

    useEffect(() => {
        if (eventSource.current !== null) {
            return;
        }

        let url = `${urlBase}/api/v1/events/sse`;

        eventSource.current = new EventSource(url);
        dispatch(updateConnectionState(ConnectionProgress.Connecting));

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
            dispatch(
                updateConnectionState(ConnectionProgress.Connected)
            );
        });

        eventSource.current.addEventListener('error', () => {
            dispatch(updateConnectionState(ConnectionProgress.Closed));
        });

        return () => {
            if (eventSource.current === null) {
                return;
            }

            eventSource.current.onmessage = null;
            eventSource.current.close();
            eventSource.current = null;

            dispatch(updateConnectionState(ConnectionProgress.Closed));
        };
    }, [urlBase]);

    return false;
};
