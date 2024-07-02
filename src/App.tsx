import { Controller } from './components/Controller';
import { ControllerStatus } from './components/ControllerStatus';
import { DeviceOverview } from './components/manage/DeviceOverview';

const App = () => {
    return (
        <div className="App">
            <Controller url="http://localhost:3000/api/v1/events/sse" />
            <ControllerStatus />
            <DeviceOverview />
        </div>
    );
};

export default App;
