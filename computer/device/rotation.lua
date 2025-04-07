local network = require "network"

local exports = {}

---@alias Rotation "+x" | "-x" | "-z" | "+z"

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
            return "+x"
        else
            return "-x"
        end
    else
        if newZ > oldZ then
            return "+z"
        else
            return "-z"
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
        type = "update:rotation",
        facing = rotation,
    })
end

function exports.recordTurnLeft()
    if rotation == nil then return end

    if rotation == "-z" then
        rotation = "-x"
    elseif rotation == "-x" then
        rotation = "+z"
    elseif rotation == "+z" then
        rotation = "+x"
    elseif rotation == "+x" then
        rotation = "-z"
    end
end

function exports.recordTurnRight()
    if rotation == nil then return end

    if rotation == "-z" then
        rotation = "+x"
    elseif rotation == "+x" then
        rotation = "+z"
    elseif rotation == "+z" then
        rotation = "-x"
    elseif rotation == "-x" then
        rotation = "-z"
    end
end

return exports
