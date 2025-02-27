import "./index.css";

import { createRoot } from "react-dom/client";

import { App } from "./app.tsx";
import Layout from "./layout.tsx";

const root = createRoot(document.getElementById("app")!);
root.render(
    <Layout>
        <App />
    </Layout>,
);
