import { requestEval, requestHeartbeat, WsConnection } from "ccm-connection";
import { HeartbeatResponse, LockType, RequestBody } from "ccm-packet";

export type TurtleActions = {
    restart: () => void;
    scan: (range: number) => void;
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

export const wrapTurtleActions = (conn: WsConnection, computerId: number): TurtleActions => {
    const sendPacket = (packet: RequestBody) => conn.sendPacket(computerId, packet);

    const runCode = async (locks: LockType[], heartbeat: boolean, code: string) => {
        await requestEval(conn, computerId, code, locks);
        if (heartbeat) {
            await requestHeartbeat(conn, computerId);
        }
    };

    return {
        restart: () => sendPacket({ type: "request:restart" }),
        scan: (range) => sendPacket({ type: "request:scan", range }),

        eval: async (locks, code) => {
            const data = await requestEval(conn, computerId, code, locks);
            return { success: !data.isError, value: data.value };
        },
        heartbeat: async () => {
            const packet = await requestHeartbeat(conn, computerId);
            return packet;
        },

        goForward: () => runCode(["movement"], false, "turtle.forward()"),
        goBack: () => runCode(["movement"], false, "turtle.back()"),
        goUp: () => runCode(["movement"], false, "turtle.up()"),
        goDown: () => runCode(["movement"], false, "turtle.down()"),
        turnLeft: () => runCode(["movement"], false, "turtle.turnLeft()"),
        turnRight: () => runCode(["movement"], false, "turtle.turnRight()"),

        digFront: () => runCode([], true, "turtle.dig()"),
        digUp: () => runCode([], true, "turtle.digUp()"),
        digDown: () => runCode([], true, "turtle.digDown()"),
        placeFront: () => runCode([], true, "turtle.place()"),
        placeUp: () => runCode([], true, "turtle.placeUp()"),
        placeDown: () => runCode([], true, "turtle.placeDown()"),
        dropFront: () => runCode([], true, "turtle.drop()"),
        dropUp: () => runCode([], true, "turtle.dropUp()"),
        dropDown: () => runCode([], true, "turtle.dropDown()"),
        suckFront: () => runCode([], true, "turtle.suck()"),
        suckUp: () => runCode([], true, "turtle.suckUp()"),
        suckDown: () => runCode([], true, "turtle.suckDown()"),
        inspectFront: () => runCode([], true, "turtle.inspect()"),
        inspectUp: () => runCode([], true, "turtle.inspectUp()"),
        inspectDown: () => runCode([], true, "turtle.inspectDown()"),

        select: (slot: number) => runCode(["inventory"], true, `turtle.select(${slot + 1})`),
    };
};
