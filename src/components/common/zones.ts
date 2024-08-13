import { RootZone, Zone } from '../../features/controller/controller-slice';

export function zoneHierarchy(idx: number, state: { [id: number]: Zone }): number[] {
    let zones: number[] = [];


    for (let i = idx; i !== RootZone; i = state[i].parentZone) {
        zones.push(i);
    }

    return zones.reverse();
}

export function zoneList(idx: number, state: { [id: number]: Zone }): number[] {
    let returnZones: number[] = [idx];

    state[idx].subZones.forEach((subZone) => {
        let subZones = zoneList(subZone, state);
        returnZones.push(...subZones);
    });

    return returnZones;
}