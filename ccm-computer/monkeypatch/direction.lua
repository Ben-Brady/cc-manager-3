local network = require "network"
local rotation = require "rotation"

local exports = {}
---@param action function
---@param direction "left" | "right"
function exports.withRotationUpdate(action, direction)
    return function()
        action()

        if direction == "right" then
            rotation.recordTurnRight()
        else
            rotation.recordTurnLeft()
        end

        local facing = rotation.getRotation()
        if facing then
            network.broadcastPacket({
                type = "update:rotation",
                facing = facing,
            })
        end
    end
end

function exports.withRotationCalibration(move)
    return function()
        local hasRotation = rotation.getRotation() ~= nil
        if hasRotation then return move() end

        local xOld, _, zOld = gps.locate(0.05, false)
        local success = move()
        local xNew, _, zNew = gps.locate(0.05, false)

        if success and xOld and xNew then
            rotation.reportMovement(xOld, xNew, zOld, zNew)
        end

        return success
    end
end

return exports
