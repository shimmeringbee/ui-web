import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import React, { FC, useState } from 'react';
import { requestNameZone, RootZone } from '../../../../features/controller/controller-slice';
import { zoneHierarchy, zoneList } from '../../../common/zones';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { useCombinedRefs } from '@dnd-kit/utilities';
import { IconDragDrop, IconEdit, IconPlus, IconX } from '@tabler/icons-react';
import { InlineEdit } from '../../../common/InlineEdit';

interface ZoneRowProps {
    zoneId: number;
}

const ZoneRow: FC<ZoneRowProps> = ({ zoneId }) => {
    const dispatch = useAppDispatch();
    const zones = useAppSelector((state) => state.controller.zones);
    const zone = zones[zoneId];

    let hierarchy = zoneHierarchy(zone.parentZone, zones)
        .map((id) => zones[id].name)
        .map((n) => n + ' > ');

    const { attributes, listeners, setNodeRef: setNodeRefDrag } = useDraggable({ id: zoneId });

    const { setNodeRef: setNodeRefDrop, isOver } = useDroppable({ id: zoneId });

    const setNodeRef = useCombinedRefs(setNodeRefDrag, setNodeRefDrop);

    let [editingName, setEditingName] = useState(false);

    return (
        <tr key={zoneId} ref={setNodeRef} className={isOver ? 'bg-gray-100' : 'bg-white'}>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 items-center flex">
                {hierarchy.length > 0 ? <div className="text-gray-500 pr-1">{hierarchy}</div> : false}
                {zoneId !== RootZone ? (
                    editingName ? (
                        <InlineEdit
                            initialValue={zone.name || ''}
                            setEditingName={setEditingName}
                            updateValue={(name) => {dispatch(requestNameZone({ zoneId: zoneId, name: name }))}}
                        />
                    ) : (
                        <>
                            <div className="pr-1">{zone.name}</div>
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
                    )
                ) : (
                    <div className="pr-1">{zone.name}</div>
                )}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 align-middle">
                <div className="font-medium text-gray-900">{zone.devices.length}</div>
            </td>
            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm text-gray-500 sm:pr-6 align-middle">
                <div className="flex">
                    <IconPlus />
                    {zoneId !== RootZone ? <IconX /> : false}
                    {zoneId !== RootZone ? <IconDragDrop {...listeners} {...attributes} /> : false}
                </div>
            </td>
        </tr>
    );
};

interface ZoneTableProps {
    zones: number[];
}

const ZoneTable: FC<ZoneTableProps> = ({ zones }) => {
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
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Devices
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {zones.map((zone) => ZoneRow({ zoneId: zone }))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Overview = () => {
    const zones = useAppSelector((state) => state.controller.zones);

    let orderedZones = zoneList(RootZone, zones);

    const [activeId, setActiveId] = useState<number>(-1);


    let dragStart = (e: DragStartEvent) => {
        setActiveId(e.active.id as number);
    };


    let dragEnd = (e: DragEndEvent) => {
        setActiveId(-1);

        if (e.over !== undefined && e.over!.id !== 0) {
            let movingId = e.active.id as number;
            let toId = e.over!.id as number;
        }
    };

    return (
        <section>
            <DndContext onDragEnd={dragEnd} onDragStart={dragStart}>
                <h1>Zone Overview</h1>
                <ZoneTable zones={orderedZones} />

                <DragOverlay>{activeId !== -1 ? <ZoneSingleRowTable zoneId={activeId} /> : false}</DragOverlay>
            </DndContext>
        </section>
    );
};

const ZoneSingleRowTable: FC<ZoneRowProps> = ({ zoneId }) => {
    return (
        <div className="flow-root shadow-xl shadow-gray-500">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <tbody className="divide-y divide-gray-200 bg-white">
                            <ZoneRow zoneId={zoneId} />
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
