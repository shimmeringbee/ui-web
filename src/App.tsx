import { Overview } from './components/controller/manage/devices/Overview';
import Frame from './components/controller/Frame';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login';

const router = createBrowserRouter([
    {
        index: true,
        element: <Login />,
    },
    {
        path: 'controller',
        element: <Frame />,
        children: [
            {
                index: true,
                element: <h1>Welcome</h1>,
            },
            {
                path: 'control',
                children: [
                    {
                        path: 'ambiance',
                        element: <h1>Ambiance Unimplemented</h1>,
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
                        element: <Overview />,
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
