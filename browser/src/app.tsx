import "./index.css";

import MainPage from "./components/extensive/MainPage";
import { ConnectionProvider } from "./context/ConnectionProvider";
import { useConnection } from "./hook/useConnection";

export function App() {
    const conn = useConnection();

    if (!conn) return <div>Connecting...</div>;

    return (
        <ConnectionProvider>
            <MainPage />
        </ConnectionProvider>
    );
}
