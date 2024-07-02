import type { FC } from 'react';
import { useAppSelector } from '../../../app/hooks';
import {
    DeviceDiscoveryName,
    DeviceRemovalName,
    EnumerateDeviceName,
    IdentifyName,
} from '../../../features/controller/capabilities';
import { EnumerateDeviceMini } from './EnumerateDevice';
import { DeviceRemovalMini } from './DeviceRemoval';
import { DeviceDiscoveryMini } from './DeviceDiscovery';
import { IdentifyMini } from './Identify';

interface CapabilityListProps {
    identifier: string;
}

function renderCapabilityMini(capName: string, identifier: string) {
    switch (capName) {
        case EnumerateDeviceName:
            return <EnumerateDeviceMini identifier={identifier} />;
        case DeviceRemovalName:
            return <DeviceRemovalMini identifier={identifier} />;
        case DeviceDiscoveryName:
            return <DeviceDiscoveryMini identifier={identifier} />;
        case IdentifyName:
            return <IdentifyMini identifier={identifier} />;
    }

    return false;
}

export const CapabilityListMini: FC<CapabilityListProps> = ({ identifier }) => {
    const capabilities = useAppSelector((state) =>
        Object.keys(state.controller.devices[identifier].capabilities)
    ).sort();
    return <div> {capabilities.map((capName) => renderCapabilityMini(capName, identifier))} </div>;
};
