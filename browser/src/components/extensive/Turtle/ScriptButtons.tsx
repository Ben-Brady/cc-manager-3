import { FC } from "react";

import MineScript from "@/assets/scripts/mine.lua?raw";
import Button from "@/components/elements/Button";
import { TurtleActions } from "@/lib/devices/turtle";

const ScriptButtons: FC<{ actions: TurtleActions }> = ({ actions }) => {
    return (
        <div className="flex gap-2 w-full">
            <Button onClick={() => actions.eval(["inventory", "movement"], MineScript)}>
                Tunnel Mine
            </Button>
        </div>
    );
};

export default ScriptButtons;
