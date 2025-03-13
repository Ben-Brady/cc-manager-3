local network = require "network"
local rotation = require "device.rotation"

local exports = {}
---@param action function
---@param direction "left" | "right"
function exports.turnWithRotationUpdate(action, direction)
    return function()
        local success, msg = action()

        if success then
            if direction == "right" then
                rotation.recordTurnRight()
            else
                rotation.recordTurnLeft()
            end

            local facing = rotation.getRotation()
            if facing then
                network.broadcastPacket({
                    type = "update:rotation",
                    facing = facing
                })
            end
        end

        return success, msg
    end
end

---@param action function
function exports.fowardWithRotationCalibration(action)
    return function()
        local hasRotation = rotation.getRotation() ~= nil
        if hasRotation then
            return action()
        end

        local xOld, _, zOld = gps.locate(0.05, false)
        local success, msg = action()
        local xNew, _, zNew = gps.locate(0.05, false)

        if success and xOld and xNew then
            rotation.reportMovement(xOld, xNew, zOld, zNew)
        end

        return success, msg
    end
end

---@param action function
function exports.backWithRotationCalibration(action)
    return function()
        local hasRotation = rotation.getRotation() ~= nil
        if hasRotation then
            return action()
        end

        local xNew, _, zNew = gps.locate(0.05, false)
        local success, msg = action()
        local xOld, _, zOld = gps.locate(0.05, false)

        if success and xOld and xNew then
            rotation.reportMovement(xOld, xNew, zOld, zNew)
        end

        return success, msg
    end
end

return exports
