import "./index.css";

import { BrowserRouter, Outlet, Route, Routes } from "react-router";

import Layout from "@/components/layouts/Layout";
import { ConnectionProvider } from "@/context/ConnectionProvider";
import HomePage from "@/pages/+index";
import TurtlePage from "@/pages/+turtle";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route element={<ConnectionProvider children={<Outlet />} />}>
                        <Route index element={<HomePage />} />
                        <Route path="/turtle/:id" element={<TurtlePage />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
