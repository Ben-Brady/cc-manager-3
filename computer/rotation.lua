local network = require "network"

local exports = {}

---@alias Rotation "east" | "west" | "north" | "south"

---@type Rotation | nil
local rotation = nil

---@return Rotation | nil
function exports.getRotation()
    return rotation
end

---@param oldX number
---@param newX number
---@param oldZ number
---@param newZ number
---@return Rotation
local function calcRotation(oldX, newX, oldZ, newZ)
    if oldZ == newZ then
        if newX > oldX then
            return "east"
        else
            return "west"
        end
    else
        if newZ > oldZ then
            return "south"
        else
            return "north"
        end
    end
end


---@param oldX number
---@param newX number
---@param oldZ number
---@param newZ number
function exports.reportMovement(oldX, newX, oldZ, newZ)
    if rotation ~= nil then return end

    rotation = calcRotation(oldX, newX, oldZ, newZ)
    network.broadcastPacket({
        type = "response:rotation",
        facing = rotation,
    })
end

---@return Rotation | nil
function exports.calibrate()
    return rotation
end

function exports.recordTurnLeft()
    if rotation == nil then return end

    if rotation == "north" then
        rotation = "west"
    elseif rotation == "west" then
        rotation = "south"
    elseif rotation == "south" then
        rotation = "east"
    elseif rotation == "east" then
        rotation = "north"
    end
    print(rotation)
end

function exports.recordTurnRight()
    if rotation == nil then return end

    if rotation == "north" then
        rotation = "east"
    elseif rotation == "east" then
        rotation = "south"
    elseif rotation == "south" then
        rotation = "west"
    elseif rotation == "west" then
        rotation = "north"
    end
end

return exports
