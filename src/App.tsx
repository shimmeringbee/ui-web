import './App.css';
import { Controller } from './components/Controller';

const App = () => {
    return (
        <div className="App">
            <Controller url="http://localhost:3000/api/v1/events/sse" />
        </div>
    );
};

export default App;
