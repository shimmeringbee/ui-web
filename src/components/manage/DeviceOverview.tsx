import { useAppSelector } from '../../app/hooks';
import type { Zone } from '../../features/controller/controller-slice';
import { RootZone } from '../../features/controller/controller-slice';
import type { FC } from 'react';
import { DeviceTable } from '../devices/DeviceTable';

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

interface ZoneSectionProps {
    zone: number;
}

const ZoneSection: FC<ZoneSectionProps> = (props) => {
    const zones = useAppSelector((state) => state.controller.zones);
    const devices = useAppSelector((state) => state.controller.devices);

    let zoneList = zoneHierarchy(props.zone, zones);
    let deviceList = zones[props.zone].devices.map((devId) => devices[devId]).map((device) => device.identifier);

    return (
        <section>
            <h2 className="text-xl font-semibold">
                {zoneList.map((zone) => `${zones[zone].name} (${zone})`).join(' > ')}
            </h2>
            <DeviceTable deviceList={deviceList} />
        </section>
    );
};

export const DeviceOverview = () => {
    const zones = useAppSelector((state) => state.controller.zones);
    const devices = useAppSelector((state) => state.controller.devices);

    let orderedZones = zoneList(RootZone, zones).filter((idx) => idx !== RootZone);

    let deviceList = Object.values(devices)
        .filter((device) => device.zones.length === 0)
        .map((device) => device.identifier);

    return (
        <section>
            <h2 className="text-xl font-semibold">Orphened Devices</h2>
            <DeviceTable deviceList={deviceList} />
            {orderedZones.map((zone) => (
                <ZoneSection zone={zone} key={zone} />
            ))}
        </section>
    );
};
