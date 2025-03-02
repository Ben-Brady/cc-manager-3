import { FC, useState } from "react";

import Button from "@/components/elements/Button";

import CanvasPage from "./CanvasPage";
import ListingPage from "./ListingPage";

type Tab = "devices" | "3d";

const MainPage: FC = () => {
    const [tab, setTab] = useState<Tab>("devices");

    return (
        <div className="w-full flex flex-col gap-4 items-center justify-center">
            <div className="flex ">
                <Button disabled={tab === "devices"} onClick={() => setTab("devices")}>
                    Devices
                </Button>
                <Button disabled={tab === "3d"} onClick={() => setTab("3d")}>
                    3d Out
                </Button>
            </div>

            {tab === "3d" && <CanvasPage />}
            {tab === "devices" && <ListingPage />}
        </div>
    );
};

export default MainPage;
