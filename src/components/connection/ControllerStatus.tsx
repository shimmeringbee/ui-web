import { useAppSelector } from '../../app/hooks';
import { ConnectionProgress } from '../../features/controller/connection-slice';

export const ControllerStatus = () => {
    const connectionState = useAppSelector((state) => state.connection.progress);
    const connectionUrl = useAppSelector((state) => state.connection.url);

    let url = '';

    if (connectionUrl.length > 0) {
        try {
            let urlObj = new URL(connectionUrl);
            url = urlObj.hostname;
        } catch (err) {}
    }

    const lastMessage = useAppSelector((state) => state.connection.lastMessage);

    let stateText = 'Unknown';

    switch (connectionState) {
        case ConnectionProgress.Idle:
            stateText = 'Idle';
            break;
        case ConnectionProgress.Connecting:
            stateText = 'Connecting...';
            break;
        case ConnectionProgress.Connected:
            stateText = 'Connected';
            break;
        case ConnectionProgress.Closed:
            stateText = 'Closed';
            break;
    }

    return (
        <div className="text-white bg-gray-800 group gap-x-3 rounded-md p-2 text-sm leading-6">
            <div className="font-semibold">{stateText}</div>
            <div className="text-xs">{url}</div>
        </div>
    );
};
