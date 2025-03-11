import { useEffect, useState } from "react";

export const useSecondsSince = (time: Date | undefined): number | undefined => {
    const [seconds, setSeconds] = useState<number | undefined>(0);

    useEffect(() => {
        if (!time) return;

        let interval = setInterval(() => {
            setSeconds(Math.floor((Date.now() - time.getTime()) / 1000));
        }, 10);

        return () => clearInterval(interval);
    }, [time]);

    return seconds;
};
