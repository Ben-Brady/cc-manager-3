import { FC } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

import Button from "../elements/Button";

const Layout: FC = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full flex flex-col gap-4 p-2 items-center justify-center">
            <div className="flex">
                <Button onClick={() => navigate("/")}>Home</Button>
            </div>

            <Outlet />
        </div>
    );
};

export default Layout;
