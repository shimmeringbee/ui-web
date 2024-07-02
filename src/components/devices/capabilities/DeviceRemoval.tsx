import type { FC } from 'react';
import { useAppSelector } from '../../../app/hooks';
import type { DeviceRemoval } from '../../../features/controller/capabilities';
import { DeviceRemovalName } from '../../../features/controller/capabilities';
import { IconTrash } from '@tabler/icons-react';

interface DeviceRemovalProps {
    identifier: string;
}

export const DeviceRemovalMini: FC<DeviceRemovalProps> = ({ identifier }) => {
    const status = useAppSelector(
        (state) => state.controller.devices[identifier].capabilities[DeviceRemovalName]
    ) as DeviceRemoval;

    return <IconTrash />;
};
