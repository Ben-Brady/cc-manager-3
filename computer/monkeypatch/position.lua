local location = require "device.location"
local network = require "network"
local globals = require "device.globals"

local exports = {}


---@param movement "up" | "down" | "forward" | "back"
---@param facing Rotation
---@return Vec3
local function getOffset(movement, facing)
    if movement == "up" then
        return {
            x = 0,
            y = 1,
            z = 0
        }
    elseif movement == "down" then
        return {
            x = 0,
            y = -1,
            z = 0
        }
    elseif movement == "forward" then
        if facing == "+x" then
            return {
                x = 1,
                y = 0,
                z = 0
            }
        end
        if facing == "-x" then
            return {
                x = -1,
                y = 0,
                z = 0
            }
        end
        if facing == "-z" then
            return {
                x = 0,
                y = 0,
                z = -1
            }
        end
        if facing == "+z" then
            return {
                x = 0,
                y = 0,
                z = 1
            }
        end
    elseif movement == "back" then
        if facing == "+x" then
            return {
                x = -1,
                y = 0,
                z = 0
            }
        end
        if facing == "-x" then
            return {
                x = 1,
                y = 0,
                z = 0
            }
        end
        if facing == "-z" then
            return {
                x = 0,
                y = 0,
                z = 1
            }
        end
        if facing == "+z" then
            return {
                x = 0,
                y = 0,
                z = -1
            }
        end
    end

    return nil
end

---@param func function
---@param movement "up" | "down" | "forward" | "back"
function exports.withPositionUpdate(func, movement)
    return function()
        local success = func()
        if not success then
            return success
        end

        if globals.facing == nil then
            location.updateFromGPS()
        else
            local offset = getOffset(movement, globals.facing)
            location.applyOffset(offset)
        end

        local newPos = location.getPosition()
        if newPos then
            network.broadcastPacket({
                type = "update:position",
                position = newPos
            })
        end
        return success
    end
end

return exports
