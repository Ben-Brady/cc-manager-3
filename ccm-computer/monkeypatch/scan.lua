local network = require "network"
local autoscan = require "autoscan"
local rotation = require "rotation"
local location = require "location"
local heartbeat = require "actions.heartbeat"

local exports = {}

---@param detectDirection "front" | "up" | "down"
---@return Vec3 | nil
local function getPositionFromDirection(detectDirection)
    local pos = location.getPosition()
    local facing = rotation.getRotation()

    if not pos then return nil end

    if (detectDirection == "up") then return { x = pos.x, y = pos.y + 1, z = pos.z } end
    if (detectDirection == "down") then return { x = pos.x, y = pos.y - 1, z = pos.z } end

    if facing == "east" then return { x = pos.x + 1, y = pos.y, z = pos.z } end
    if facing == "west" then return { x = pos.x - 1, y = pos.y, z = pos.z } end
    if facing == "north" then return { x = pos.x, y = pos.y, z = pos.z - 1 } end
    if facing == "south" then return { x = pos.x, y = pos.y, z = pos.z + 1 } end
    return nil
end

---@param func function
---@param detectDirection "front" | "up" | "down"
function exports.withInspectReport(func, detectDirection)
    return function()
        local success, info = func()

        local block
        if success then
            block = info.name
        else
            block = "minecraft:air"
        end

        local blockPos = getPositionFromDirection(detectDirection)
        if blockPos then
            network.broadcastPacket({
                type = "update:block-detection",
                position = blockPos,
                block = block
            })
        end

        return success, info
    end
end

---@param func function
function exports.withTurnScan(func)
    return function()
        local success = func()
        if autoscan.enabled then turtle.inspect() end
        return success
    end
end

function exports.withMovementScan(func)
    return function()
        local success = func()
        if autoscan.enabled then
            autoscan.scan()
        end
        return success
    end
end

---@param func function
---@param side "up" | "down" | "front"
function exports.withDigUpdate(func, side)
    return function(v)
        local success, msg = func(v)

        if autoscan.enabled then
            if side == "up" then
                turtle.inspectUp()
            elseif side == "down" then
                turtle.inspectDown()
            elseif side == "front" then
                turtle.inspect()
            end
        end

        return success, msg
    end
end

return exports
