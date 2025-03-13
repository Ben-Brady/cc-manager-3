import { useFrame } from "@react-three/fiber";
import { FC, useEffect } from "react";

let frameTimes = [];
const FPSCounter: FC = () => {
    useEffect(() => {
        const interval = setInterval(() => {
            console.l;
        }, 200);
        return () => clearInterval(interval);
    }, []);

    useFrame((state, delta) => {
        console.log(`${1 / delta}FPS`);
    });

    return null;
};

export default FPSCounter;
