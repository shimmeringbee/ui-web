import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { requestAddDeviceToZone, RootZone, Zone } from '../../features/controller/controller-slice';
import React, { FC, useState } from 'react';
import { DeviceSingleRowTable, DeviceTable } from '../devices/DeviceTable';
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { Switch } from '@headlessui/react';
import { IconChevronRight } from '@tabler/icons-react';

function zoneList(idx: number, state: { [id: number]: Zone }): number[] {
    let returnZones: number[] = [idx];

    state[idx].subZones.forEach((subZone) => {
        let subZones = zoneList(subZone, state);
        returnZones.push(...subZones);
    });

    return returnZones;
}

function zoneHierarchy(idx: number, state: { [id: number]: Zone }): number[] {
    let zones: number[] = [];

    for (let i = idx; i !== RootZone; i = state[i].parentZone) {
        zones.push(i);
    }

    return zones.reverse();
}

interface ZoneHeaderProps {
    names: string[];
}

const ZoneHeader: FC<ZoneHeaderProps> = ({ names }) => {
    let end = names.length - 1;
    let items = names.map((name, index) => (
        <li key={name}>
            <div className="flex">
                {index !== 0 && <IconChevronRight aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-gray-600" />}
                <div className="text-sm font-medium text-gray-500 flex">{name}</div>
            </div>
        </li>
    ));

    return (
        <nav aria-label="Breadcrumb">
            <ol role="list" className="flex items-left mt-4 mb-1">
                {items}
            </ol>
        </nav>
    );
};

interface ZoneSectionProps {
    zone: number;
    overZoneId: number;
    showEmptyZones?: boolean;
}

const ZoneOrphan: FC<ZoneSectionProps> = (props) => {
    const devices = useAppSelector((state) => state.controller.devices);

    let orphanedDevices = Object.values(devices)
        .filter((device) => device.zones.length === 0)
        .map((device) => device.identifier);

    if (orphanedDevices.length === 0 && !props.showEmptyZones) {
        return false;
    }

    return (
        <section>
            <ZoneHeader names={['Orphaned Devices']} />
            <DeviceTable deviceList={orphanedDevices} zoneId={props.zone} dragOver={props.zone === props.overZoneId} />
        </section>
    );
};

const ZoneSection: FC<ZoneSectionProps> = (props) => {
    const zones = useAppSelector((state) => state.controller.zones);
    const devices = useAppSelector((state) => state.controller.devices);

    let zoneList = zoneHierarchy(props.zone, zones);
    let deviceList = zones[props.zone].devices.map((devId) => devices[devId]).map((device) => device.identifier);

    if (deviceList.length === 0 && !props.showEmptyZones) {
        return false;
    }

    return (
        <section>
            <ZoneHeader names={zoneList.map((zone) => zones[zone].name || 'Unnamed')} />
            <DeviceTable deviceList={deviceList} zoneId={props.zone} dragOver={props.zone === props.overZoneId} />
        </section>
    );
};

export const DeviceOverview = () => {
    const dispatch = useAppDispatch();
    const zones = useAppSelector((state) => state.controller.zones);

    let orderedZones = zoneList(RootZone, zones).filter((idx) => idx !== RootZone);

    const [activeId, setActiveId] = useState<string>('');
    const [overZoneId, setOverZoneId] = useState<number>(-1);
    const [showEmptyZones, setShowEmptyZones] = useState<boolean>(false);

    let dragStart = (e: DragStartEvent) => {
        setActiveId(e.active.id as string);
    };

    let dragOver = (e: DragOverEvent) => {
        let overId = e.over?.id;

        if (overId !== undefined) {
            setOverZoneId(overId as number);
        } else {
            setOverZoneId(-1);
        }
    };

    let dragEnd = (e: DragEndEvent) => {
        setActiveId('');
        setOverZoneId(-1);

        if (e.over !== undefined && e.over!.id !== 0) {
            let deviceId = e.active.id as string;
            let zoneId = e.over!.id as number;

            dispatch(requestAddDeviceToZone({ deviceId, zoneId }));
        }
    };

    return (
        <section>
            <DndContext onDragEnd={dragEnd} onDragStart={dragStart} onDragOver={dragOver}>
                <h1>Device Overview</h1>

                <span className="inline-flex rounded-md shadow-sm">
                    <span className="inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2">
                        <Switch
                            checked={showEmptyZones}
                            onChange={setShowEmptyZones}
                            className="group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 data-[checked]:bg-indigo-600"
                        >
                            <span className="sr-only">Use setting</span>
                            <span
                                aria-hidden="true"
                                className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                            />
                        </Switch>
                    </span>
                    <div className="-ml-px block w-full rounded-l-none rounded-r-md border-0 bg-white pt-2 pl-3 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                        Show empty zones
                    </div>
                </span>

                <ZoneOrphan zone={0} overZoneId={overZoneId} showEmptyZones={showEmptyZones} />

                {orderedZones.map((zone) => (
                    <ZoneSection zone={zone} key={zone} overZoneId={overZoneId} showEmptyZones={showEmptyZones} />
                ))}

                <DragOverlay>{activeId !== '' ? <DeviceSingleRowTable identifier={activeId} /> : false}</DragOverlay>
            </DndContext>
        </section>
    );
};
