import "./index.css";

import ComputerListing from "./components/extensive/ComputerListing";
import { useConnection } from "./hook/useConnection";

export function App() {
    const conn = useConnection();

    if (!conn) return <div>Connecting...</div>;
    return <ComputerListing conn={conn} />;
}
