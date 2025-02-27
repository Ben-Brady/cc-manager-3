import { FC, useRef, useState } from "react";

import { TurtleActions } from "@/lib/devices/turtle";
import Button from "@/components/elements/Button";

const UserCodeRun: FC<{ actions: TurtleActions }> = ({ actions }) => {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [output, setOutput] = useState<string | undefined>(undefined);
    const [runningUserCode, setRunning] = useState<boolean>(false);

    const onRun = async () => {
        const element = inputRef.current;
        if (!element) return;

        const code = element.value;

        setRunning(true);
        const r = await actions.eval(["inventory", "movement"], code);
        await actions.heartbeat();
        setRunning(false);

        const value = r.value;
        setOutput(value);
    };

    const onClear = () => {
        const element = inputRef.current;
        if (!element) return;
        element.value = "";
    };

    return (
        <div className="flex flex-col gap-1 w-full">
            <textarea
                ref={inputRef}
                className="resize-none w-full h-32 font-minecraft overflow-auto bg-black-700 text-gray-100 border-none outline-none p-1"
            />
            {output && (
                <textarea
                    value={output}
                    className="resize-none w-full h-min font-minecraft overflow-auto bg-black-700 bg-mgray text-gray-100 border-none outline-none p-1"
                />
            )}
            <div className="flex gap-2">
                <Button onClick={onRun} disabled={runningUserCode}>
                    Run Code
                </Button>
                <Button onClick={onClear} disabled={runningUserCode}>
                    Clear
                </Button>
            </div>
        </div>
    );
};

export default UserCodeRun;
