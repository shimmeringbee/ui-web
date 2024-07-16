import { DeviceOverview } from './components/manage/DeviceOverview';
import ControllerFrame from './components/ControllerFrame';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ControllerLogin from './components/ControllerLogin';

const router = createBrowserRouter([
    {
        index: true,
        element: <ControllerLogin />,
    },
    {
        path: 'controller',
        element: <ControllerFrame />,
        children: [
            {
                index: true,
                element: <h1>Welcome</h1>,
            },
            {
                path: 'control',
                children: [
                    {
                        path: 'lighting',
                        element: <h1>Lighting Unimplemented</h1>,
                    },
                    {
                        path: 'devices',
                        element: <h1>Devices Unimplemented</h1>,
                    },
                    {
                        path: 'hvac',
                        element: <h1>HVAC Unimplemented</h1>,
                    },
                    {
                        path: 'security',
                        element: <h1>Security Unimplemented</h1>,
                    },
                    {
                        path: 'metering',
                        element: <h1>Metering Unimplemented</h1>,
                    },
                ],
            },
            {
                path: 'manage',
                children: [
                    {
                        path: 'devices',
                        element: <DeviceOverview />,
                    },
                    {
                        path: 'zones',
                        element: <h1>Zones Unimplemented</h1>,
                    },
                    {
                        path: 'automations',
                        element: <h1>Automations Unimplemented</h1>,
                    }
                ],
            },
        ],
    },
]);

const App = () => {
    return <RouterProvider router={router} />;
};

export default App;
