import type { FC } from 'react';
import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import type { Identify } from '../../../features/controller/capabilities';
import { IdentifyName } from '../../../features/controller/capabilities';
import { IconIdBadge } from '@tabler/icons-react';

interface IdentifyProps {
    identifier: string;
}

export const IdentifyMini: FC<IdentifyProps> = ({ identifier }) => {
    const status = useAppSelector(
        (state) => state.controller.devices[identifier].capabilities[IdentifyName]
    ) as Identify;

    return <IconIdBadge />;
};
