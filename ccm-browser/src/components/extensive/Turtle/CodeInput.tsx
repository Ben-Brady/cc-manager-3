import { FC, useRef, useState } from "react";

import Button from "@/components/elements/Button";
import { TurtleActions } from "@/lib/devices/turtle";

const CodeInput: FC<{ actions: TurtleActions }> = ({ actions }) => {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [output, setOutput] = useState<string | undefined>(undefined);
    const [runningUserCode, setRunning] = useState<boolean>(false);

    const onRun = async () => {
        const element = inputRef.current;
        if (!element) return;

        const code = element.value;

        setOutput("");
        setRunning(true);
        const r = await actions.eval(["movement"], code);
        await actions.heartbeat();
        setRunning(false);

        let value = r.value ? JSON.parse(r.value) : undefined;

        if (typeof value === "undefined") {
            setOutput("nil");
        } else if (typeof value === "string") {
            setOutput(value);
        } else {
            setOutput(r.value);
        }
    };

    const onClear = () => {
        const element = inputRef.current;
        if (!element) return;
        setOutput("");
        element.value = "";
    };

    return (
        <div className="flex flex-col gap-1 w-full">
            <textarea
                ref={inputRef}
                className="resize-none w-full h-64 font-minecraft overflow-auto bg-black-700 text-gray-100 border-none outline-none p-1"
            />
            {output && (
                <textarea
                    value={output}
                    readOnly
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
                <Button onClick={() => setOutput("")} disabled={runningUserCode}>
                    Clear Output
                </Button>
            </div>
        </div>
    );
};

export default CodeInput;
