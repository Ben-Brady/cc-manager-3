local network = require "network"
local globals = require "device.globals"

local exports = {}


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
    if globals.facing ~= nil then return end

    globals.facing = calcRotation(oldX, newX, oldZ, newZ)
    network.broadcastPacket({
        type = "update:rotation",
        facing = globals.facing,
    })
end

function exports.recordTurnLeft()
    if globals.facing == nil then return end

    if globals.facing == "-z" then
        globals.facing = "-x"
    elseif globals.facing == "-x" then
        globals.facing = "+z"
    elseif globals.facing == "+z" then
        globals.facing = "+x"
    elseif globals.facing == "+x" then
        globals.facing = "-z"
    end
end

function exports.recordTurnRight()
    if globals.facing == nil then return end

    if globals.facing == "-z" then
        globals.facing = "+x"
    elseif globals.facing == "+x" then
        globals.facing = "+z"
    elseif globals.facing == "+z" then
        globals.facing = "-x"
    elseif globals.facing == "-x" then
        globals.facing = "-z"
    end
end

return exports
