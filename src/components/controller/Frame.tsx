import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react';
import { ControllerStatus } from '../common/connection/ControllerStatus';
import { Outlet, useLocation } from 'react-router';
import { Controller } from '../common/connection/Controller';
import { Link } from 'react-router-dom';
import {
    IconAirConditioning, IconAutomation,
    IconBulb,
    IconCpu,
    IconGauge,
    IconHome,
    IconMap, IconMenu2,
    IconShield, IconSmartHome, IconX,
} from '@tabler/icons-react';

const root = [
    { name: 'Dashboard', href: '/controller', icon: IconHome},
];

const control = [
    { name: 'Ambiance', href: '/controller/control/ambiance', icon: IconBulb },
    { name: 'Smart Devices', href: '/controller/control/devices', icon: IconSmartHome },
    { name: 'Heating and Cooling', href: '/controller/control/hvac', icon: IconAirConditioning },
    { name: 'Security and Safety', href: '/controller/control/security', icon: IconShield },
    { name: 'Metering', href: '/controller/control/metering', icon: IconGauge },

];

const manage = [
    { name: 'Devices', href: '/controller/manage/devices', icon: IconCpu },
    { name: 'Zones', href: '/controller/manage/zones', icon: IconMap },
    { name: 'Automations', href: '/controller/manage/automations', icon: IconAutomation },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

function MenuLogo() {
    return (
        <div className="flex h-16 items-center">
            <div className="text-gray-400 text-center font-semibold">Shimmering Bee</div>
        </div>
    );
}

function MenuOptions() {
    let location = useLocation();

    return (
        <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                    <ul role="list" className="-mx-2 space-y-1">
                        {root.map((item) => (
                            <li key={item.name}>
                                <Link
                                    to={item.href}
                                    className={classNames(
                                        (location.pathname === item.href)
                                            ? 'bg-gray-800 text-white'
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                                    )}
                                >
                                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </li>
                <li>
                    <div className="text-xs font-semibold leading-6 text-gray-400">Control</div>
                    <ul role="list" className="-mx-2 space-y-1">
                        {control.map((item) => (
                            <li key={item.name}>
                                <Link
                                    to={item.href}
                                    className={classNames(
                                        (location.pathname === item.href)
                                            ? 'bg-gray-800 text-white'
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                                    )}
                                >
                                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </li>
                <li>
                    <div className="text-xs font-semibold leading-6 text-gray-400">Manage</div>
                    <ul role="list" className="-mx-2 space-y-1">
                        {manage.map((item) => (
                            <li key={item.name}>
                                <Link
                                    to={item.href}
                                    className={classNames(
                                        (location.pathname === item.href)
                                            ? 'bg-gray-800 text-white'
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                                    )}
                                >
                                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </li>
                <li className="-mx-2 mt-auto mb-4">
                    <ControllerStatus />
                </li>
            </ul>
        </nav>
    );
}


function Menu() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <Dialog className="relative z-50 lg:hidden" open={sidebarOpen} onClose={setSidebarOpen}>
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
                />

                <div className="fixed inset-0 flex">
                    <DialogPanel
                        transition
                        className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
                    >
                        <TransitionChild>
                            <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                                <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                                    <span className="sr-only">Close sidebar</span>
                                    <IconX className="h-6 w-6 text-white" aria-hidden="true" />
                                </button>
                            </div>
                        </TransitionChild>
                        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
                            <MenuLogo />
                            <MenuOptions />
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
                    <MenuLogo />
                    <MenuOptions />
                </div>
            </div>

            <div
                className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
                <button
                    type="button"
                    className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
                    onClick={() => setSidebarOpen(true)}
                >
                    <span className="sr-only">Open sidebar</span>
                    <IconMenu2 className="h-6 w-6" aria-hidden="true" />
                </button>
                <div className="flex-1 text-sm font-semibold leading-6 text-white">Dashboard</div>
            </div>
        </>
    );
}

export default function Frame() {
    return (
        <>
            <div>
                <Controller />

                <Menu />

                <main className="py-10 lg:pl-72">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </>
    );
}
