import { FC, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import type { ProductInformation } from '../../features/controller/capabilities';
import { QuickActionList } from './QuickActionList';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { IconCheck, IconDragDrop, IconEdit, IconX } from '@tabler/icons-react';
import { IconList } from './capabilities/IconList';
import { requestNameDevice } from '../../features/controller/controller-slice';

interface DeviceTableProps {
    deviceList: string[];
    zoneId: number;
    dragOver: boolean;
}

export const DeviceTable: FC<DeviceTableProps> = (props) => {
    let devicesList = props.deviceList.sort();

    let rows = devicesList.map((device) => <DeviceRow identifier={device} key={device} />);

    if (rows.length === 0) {
        rows = [
            <tr className="h-10" key="none">
                <td
                    colSpan={4}
                    className="h-20 whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-6 align-middle text-center"
                >
                    No devices in zone.
                </td>
            </tr>,
        ];
    }

    const { setNodeRef } = useDroppable({
        id: props.zoneId,
    });

    return (
        <div className="flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                    >
                                        Identity
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Product
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Capabilities
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody
                                className={'divide-y divide-gray-200 ' + (props.dragOver ? 'bg-gray-100' : 'bg-white')}
                                ref={setNodeRef}
                            >
                                {rows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface InlineDeviceNameEditProps {
    identifier: string;
    setEditingName: (value: ((prevState: boolean) => boolean) | boolean) => void;
}

const InlineDeviceNameEdit: FC<InlineDeviceNameEditProps> = (props) => {
    const deviceName = useAppSelector((state) => state.controller.devices[props.identifier].name);
    const dispatch = useAppDispatch();

    const [name, setName] = useState(deviceName);

    return (
        <div className="flex">
            <label htmlFor="email" className="sr-only">
                Device Name
            </label>
            <input
                id="name"
                name="name"
                type="name"
                value={name}
                className="block w-full rounded-md border-0 pl-2.5 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onInput={(e) => {
                    return setName(e.currentTarget.value);
                }}
            />
            <button
                type="button"
                className="p-1 text-gray-500 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => {
                    dispatch(requestNameDevice({ deviceId: props.identifier, name: name || '' }));
                    props.setEditingName(false);
                }}
            >
                <IconCheck aria-hidden="true" className="h-5 w-5" />
            </button>
            <button
                type="button"
                className="p-1 text-gray-500 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => {
                    props.setEditingName(false);
                }}
            >
                <IconX aria-hidden="true" className="h-5 w-5" />
            </button>
        </div>
    );
};

interface DeviceRowProps {
    identifier: string;
}

const DeviceRow: FC<DeviceRowProps> = ({ identifier }) => {
    const device = useAppSelector((state) => state.controller.devices[identifier]);

    let productInfo: ProductInformation | undefined = undefined;

    if ('ProductInformation' in device.capabilities) {
        productInfo = device.capabilities['ProductInformation'] as ProductInformation;
    }

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: identifier,
    });

    let [editingName, setEditingName] = useState(false);

    return (
        <tr className={'h-20 ' + (isDragging ? 'animate-pulse' : '')} ref={setNodeRef}>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 align-top">
                <div className="font-medium text-gray-900">{device.identifier}</div>
                <div className="mt-1 text-gray-500 flex">
                    {editingName ? (
                        <InlineDeviceNameEdit identifier={device.identifier} setEditingName={setEditingName} />
                    ) : (
                        <>
                            {device.name && <div className="pr-2">{device.name}</div>}
                            <button
                                type="button"
                                className="p-0.5 text-gray-500 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                onClick={() => {
                                    setEditingName(true);
                                }}
                            >
                                <IconEdit aria-hidden="true" className="h-4 w-4" />
                            </button>
                        </>
                    )}
                </div>
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 align-top">
                {productInfo?.Manufacturer !== undefined && (
                    <div className="mr-1 mb-1">{productInfo?.Manufacturer}</div>
                )}
                {productInfo?.Name !== undefined && <div className="">{productInfo?.Name}</div>}
            </td>
            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm text-gray-500 sm:pr-6 align-middle">
                <div className="flex">
                    <IconList capabilities={Object.keys(device.capabilities)} />
                </div>
            </td>
            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm text-gray-500 sm:pr-6 align-middle">
                <div className="flex">
                    <QuickActionList identifier={identifier} />
                    <IconDragDrop {...listeners} {...attributes} />
                </div>
            </td>
        </tr>
    );
};

export const DeviceSingleRowTable: FC<DeviceRowProps> = ({ identifier }) => {
    return (
        <div className="flow-root shadow-xl shadow-gray-500">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <tbody className="divide-y divide-gray-200 bg-white">
                                <DeviceRow identifier={identifier} />
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
