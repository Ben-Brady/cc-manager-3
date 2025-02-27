import { HeartbeatResponse, RequestBody } from "../packet";
import { LockType } from "../packet/generic";
import { WsConnection } from "../ws/connection";
import { sendEval, sendHeartbeat } from "./requests";

export type TurtleActions = {
    restart: () => void;
    calibrateRotation: () => void;
    scan: () => void;
    eval: (locks: LockType[], code: string) => Promise<{ success: boolean; value: string }>;
    heartbeat: () => Promise<HeartbeatResponse>;

    select: (slot: number) => Promise<void>;

    goForward: () => Promise<void>;
    goBack: () => Promise<void>;
    goUp: () => Promise<void>;
    goDown: () => Promise<void>;

    turnLeft: () => Promise<void>;
    turnRight: () => Promise<void>;

    digFront: () => Promise<void>;
    digUp: () => Promise<void>;
    digDown: () => Promise<void>;

    placeFront: () => Promise<void>;
    placeUp: () => Promise<void>;
    placeDown: () => Promise<void>;

    dropFront: () => Promise<void>;
    dropUp: () => Promise<void>;
    dropDown: () => Promise<void>;

    suckFront: () => Promise<void>;
    suckUp: () => Promise<void>;
    suckDown: () => Promise<void>;

    inspectFront: () => Promise<void>;
    inspectUp: () => Promise<void>;
    inspectDown: () => Promise<void>;
};

export const createTurtleActions = (conn: WsConnection, computerId: number): TurtleActions => {
    const sendPacket = (packet: RequestBody) => conn.sendPacket(computerId, packet);

    const runCode = async (locks: LockType[], code: string) => {
        await sendEval(conn, computerId, { code, locks });
        await sendHeartbeat(conn, computerId, {});
    };

    return {
        restart: () => sendPacket({ type: "request:restart" }),
        calibrateRotation: () => sendPacket({ type: "request:rotation" }),
        scan: () => runCode([], "turtle.inspect() turtle.inspectDown() turtle.inspectUp()"),

        eval: async (locks, code) => {
            const data = await sendEval(conn, computerId, { locks, code });
            return { success: !data.isError, value: data.value };
        },
        heartbeat: () => sendHeartbeat(conn, computerId, {}),

        goForward: () => runCode(["movement"], "turtle.forward()"),
        goBack: () => runCode(["movement"], "turtle.back()"),
        goUp: () => runCode(["movement"], "turtle.up()"),
        goDown: () => runCode(["movement"], "turtle.down()"),
        turnLeft: () => runCode(["movement"], "turtle.turnLeft()"),
        turnRight: () => runCode(["movement"], "turtle.turnRight()"),

        digFront: () => runCode([], "turtle.dig()"),
        digUp: () => runCode([], "turtle.digUp()"),
        digDown: () => runCode([], "turtle.digDown()"),
        placeFront: () => runCode([], "turtle.place()"),
        placeUp: () => runCode([], "turtle.placeUp()"),
        placeDown: () => runCode([], "turtle.placeDown()"),
        dropFront: () => runCode([], "turtle.drop()"),
        dropUp: () => runCode([], "turtle.dropUp()"),
        dropDown: () => runCode([], "turtle.dropDown()"),
        suckFront: () => runCode([], "turtle.suck()"),
        suckUp: () => runCode([], "turtle.suckUp()"),
        suckDown: () => runCode([], "turtle.suckDown()"),
        inspectFront: () => runCode([], "turtle.inspect()"),
        inspectUp: () => runCode([], "turtle.inspectUp()"),
        inspectDown: () => runCode([], "turtle.inspectDown()"),

        select: (slot: number) => runCode(["inventory"], `turtle.select(${slot + 1})`),
    };
};
