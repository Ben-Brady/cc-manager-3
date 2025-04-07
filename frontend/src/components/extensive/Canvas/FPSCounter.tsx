import { useFrame } from "@react-three/fiber";
import { round, sum } from "lodash";
import { FC, useEffect } from "react";

let frameTimes: number[] = [];
const FPSCounter: FC = () => {
    useEffect(() => {
        const interval = setInterval(() => {
            const recentFrames = frameTimes.slice(-10);
            const avg = sum(recentFrames) / recentFrames.length;
            const fps = round(1 / avg, 1);
            console.log(`${fps}FPS`);
        }, 200);
        return () => clearInterval(interval);
    }, []);

    useFrame((_, delta) => {
        frameTimes.push(delta);
    });

    return null;
};

export default FPSCounter;
