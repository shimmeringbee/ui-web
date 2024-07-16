import type { FC } from 'react';
import { useAppSelector } from '../../../app/hooks';
import type { DeviceDiscovery } from '../../../features/controller/capabilities';
import { DeviceDiscoveryName } from '../../../features/controller/capabilities';
import { IconPlus } from '@tabler/icons-react';

interface DeviceDiscoveryProps {
    identifier: string;
}

export const DeviceDiscoveryMini: FC<DeviceDiscoveryProps> = ({ identifier }) => {
    const status = useAppSelector(
        (state) => state.controller.devices[identifier].capabilities[DeviceDiscoveryName]
    ) as DeviceDiscovery;

    return <IconPlus />;
};
