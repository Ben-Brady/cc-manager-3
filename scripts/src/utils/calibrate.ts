import { requestEval, requestHeartbeat, type WsConnection } from "ccm-connection";
import type { Computer } from "ccm-packet";

export const calibrateTurtle = async (conn: WsConnection, device: Computer) => {
    await requestHeartbeat(conn, device.id);

    if (!device.facing) {
        await calibrateRotation(conn, device);
    }

    if (!device.leftHand || !device.rightHand) {
        await calibrateSlots(conn, device);
    }

    await requestHeartbeat(conn, device.id);
};

const calibrateRotation = async (conn: WsConnection, device: Computer) => {
    const code = `
    local turns = 0

    while turns < 4 do
        turtle.turnRight()
        turns = turns + 1
        local obstructed = turtle.detect()
        if not obstructed then
            turtle.forward()
            turtle.back()
            break
        end
    end

    if turns == 1 then
        turtle.turnLeft()
    elseif turns == 2 then
        turtle.turnLeft()
        turtle.turnLeft()
    elseif turns == 3 then
        turtle.turnRight()
    elseif turns == 4 then
        error("No available movements to calibrate rotation")
    end
    `;
    await requestEval(conn, {
        deviceId: device.id,
        code,
        locks: ["movement"],
        timeout: 10_000,
    });
};

const calibrateSlots = async (conn: WsConnection, device: Computer) => {
    const code = `
    local emptySlot = nil
    for i = 1, 16 do
        local slot = turtle.getItemDetail(i)
        if slot == nil then
            emptySlot = i
            break
        end
    end

    if emptySlot == nil then
        error("No empty slot found")
    end

    turtle.select(emptySlot)

    turtle.equipLeft()  -- Un-equip
    turtle.equipLeft()  -- Re-equip

    turtle.equipRight() -- Un-equip
    turtle.equipRight() -- Re-equip
    `;
    const result = await requestEval(conn, {
        deviceId: device.id,
        code,
        locks: ["inventory"],
        timeout: 10_000,
    });
    if (result.isError) throw new Error(result.value);
};
