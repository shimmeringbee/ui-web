import type { FC } from 'react';
import { useAppSelector } from '../../app/hooks';
import {
    DeviceDiscoveryName,
    DeviceRemovalName,
    EnumerateDeviceName,
    IdentifyName,
} from '../../features/controller/capabilities';
import { EnumerateDeviceMini } from './capabilities/EnumerateDevice';
import { DeviceRemovalMini } from './capabilities/DeviceRemoval';
import { DeviceDiscoveryMini } from './capabilities/DeviceDiscovery';
import { IdentifyMini } from './capabilities/Identify';

interface CapabilityListProps {
    identifier: string;
}

function renderQuickAction(capName: string, identifier: string) {
    switch (capName) {
        case EnumerateDeviceName:
            return <EnumerateDeviceMini identifier={identifier} key={capName} />;
        case DeviceRemovalName:
            return <DeviceRemovalMini identifier={identifier} key={capName} />;
        case DeviceDiscoveryName:
            return <DeviceDiscoveryMini identifier={identifier} key={capName} />;
        case IdentifyName:
            return <IdentifyMini identifier={identifier} key={capName} />;
    }

    return false;
}

export const QuickActionList: FC<CapabilityListProps> = ({ identifier }) => {
    const capabilities = useAppSelector((state) => state.controller.devices[identifier].capabilities);

    let capNames = Object.keys(capabilities).sort();
    return <> {capNames.map((capName) => renderQuickAction(capName, identifier))} </>;
};
