import React, { FC } from 'react';
import {
    IconBell,
    IconBellRinging,
    IconBolt,
    IconBugOff,
    IconDialpad,
    IconDroplet,
    IconEyeDotted,
    IconGauge,
    IconIdBadge,
    IconLamp,
    IconPlus,
    IconPower,
    IconQuestionMark,
    IconSitemap,
    IconSun,
    IconTag,
    IconTemperature,
    IconTool,
    IconUsers,
    IconWind,
    IconWindow,
    IconX,
    IconZoom,
} from '@tabler/icons-react';
import {
    AlarmsSensorName,
    AlarmWarningDeviceName,
    BasicHumanInterfaceDeviceName,
    ConnectivityName,
    CoverName,
    DeviceAlarmsName,
    DeviceDiscoveryName,
    DeviceRemovalName,
    DeviceWorkaroundsName,
    EnergySensorName,
    EnumerateDeviceName,
    IdentifyName,
    IllustrationSensorName,
    LightName,
    LocalDebugName,
    OccupancySensorName,
    OnOffName,
    PowerSupplyName,
    PressureSensorName,
    ProductInformationName,
    RelativeHumiditySensorName,
    RemoteDebugName,
    TemperatureSensorName,
} from '../../../features/controller/capabilities';

interface IconListProps {
    capabilities: string[];
}

function mapCapabilityToIcon(name: string) {
    switch (name) {
        case ProductInformationName:
            return <IconTag title="Product Information" />;
        case EnumerateDeviceName:
            return <IconZoom title="Enumerate Device" />;
        case DeviceRemovalName:
            return <IconX title="Remove device" />;
        case DeviceDiscoveryName:
            return <IconPlus title="Device Discovery" />;
        case IdentifyName:
            return <IconIdBadge title="Identify" />;
        case PowerSupplyName:
            return <IconBolt title="Power Supply" />;
        case ConnectivityName:
            return <IconSitemap title="Connectivity" />;
        case DeviceAlarmsName:
            return <IconBell title="Device Alarms" />;
        case OnOffName:
            return <IconPower title="On/Off" />;
        case LightName:
            return <IconLamp title="Light" />;
        case CoverName:
            return <IconWindow title="Cover" />;
        case BasicHumanInterfaceDeviceName:
            return <IconDialpad title="Basic Human Interface Device" />;
        case TemperatureSensorName:
            return <IconTemperature title="Temperature Sensor" />;
        case RelativeHumiditySensorName:
            return <IconDroplet title="Relative Humidity Sensor" />;
        case PressureSensorName:
            return <IconWind title="Pressure Sensor" />;
        case OccupancySensorName:
            return <IconUsers title="Occupancy Sensor" />;
        case IllustrationSensorName:
            return <IconSun title="Illustration Sensor" />;
        case EnergySensorName:
            return <IconGauge title="Energy Sensor" />;
        case AlarmsSensorName:
            return <IconEyeDotted title="Alarm Sensor" />;
        case AlarmWarningDeviceName:
            return <IconBellRinging title="Alarm Warning Device" />;
        case LocalDebugName:
            return <IconBugOff title="Local Debug" />;
        case RemoteDebugName:
            return <IconBugOff title="Remote Debug" />;
        case DeviceWorkaroundsName:
            return <IconTool title="Device Workarounds" />;
        default:
            return <IconQuestionMark title={name} />;
    }
}

export const IconList: FC<IconListProps> = (props) => {
    return props.capabilities.sort().map((capability) => mapCapabilityToIcon(capability));
};
