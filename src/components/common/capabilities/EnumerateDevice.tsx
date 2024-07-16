import type { FC } from 'react';
import { useAppSelector } from '../../../app/hooks';
import type { EnumerateDevice } from '../../../features/controller/capabilities';
import { EnumerateDeviceName } from '../../../features/controller/capabilities';
import { IconZoom } from '@tabler/icons-react';

interface EnumerateDeviceProps {
    identifier: string;
}

export const EnumerateDeviceMini: FC<EnumerateDeviceProps> = ({ identifier }) => {
    const status = useAppSelector(
        (state) => state.controller.devices[identifier].capabilities[EnumerateDeviceName]
    ) as EnumerateDevice;

    return <IconZoom />;
};
