import type { FC } from 'react';
import { useAppSelector } from '../../app/hooks';
import type { ProductInformation } from '../../features/controller/capabilities';
import { CapabilityListMini } from './capabilities/ListMini';

interface DeviceTableProps {
    deviceList: string[];
}

export const DeviceTable: FC<DeviceTableProps> = (props) => {
    let devicesList = props.deviceList.sort();

    return (
        <table>
            <thead>
                <th>Identifier</th>
                <th>Product</th>
                <th />
            </thead>
            <tbody>
                {devicesList.map((device) => (
                    <DeviceRow identifier={device} />
                ))}
            </tbody>
        </table>
    );
};

interface DeviceRowProps {
    identifier: string;
}

const DeviceRow: FC<DeviceRowProps> = ({ identifier }) => {
    const device = useAppSelector((state) => state.controller.devices[identifier]);

    let productName = '';

    if ('ProductInformation' in device.capabilities) {
        let productInfo = device.capabilities['ProductInformation'] as ProductInformation;
        productName = [productInfo.Manufacturer, productInfo.Name].filter((x) => x !== undefined).join(' ');
    }

    return (
        <tr>
            <td>{device.identifier}</td>
            <td>{productName}</td>
            <td>
                <CapabilityListMini identifier={identifier} />
            </td>
        </tr>
    );
};
