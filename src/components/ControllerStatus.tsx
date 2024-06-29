import { useAppSelector } from '../app/hooks';

export const ControllerStatus = () => {
    const connectionState = useAppSelector(
        (state) => state.controller.connectionState
    );
    const lastMessage = useAppSelector((state) => state.controller.lastMessage);

    return (
        <div>
            <h1>
                Controller Yo! - {connectionState} {lastMessage}
            </h1>
        </div>
    );
};
