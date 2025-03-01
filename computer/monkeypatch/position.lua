local location = require "location"
local rotation = require "rotation"
local network = require "network"

local exports = {}

---@param func function
---@param movement "up" | "down" | "forward" | "back"
function exports.withPositionUpdate(func, movement)
    return function()
        local success = func()
        if not success or not location.hasGPS then
            return success
        end

        local facing = rotation.getRotation()

        ---@type Vec3 | nil
        local offset = (function()
            if movement == "up" then
                return { x = 0, y = 1, z = 0 }
            elseif movement == "down" then
                return { x = 0, y = -1, z = 0 }
            elseif movement == "forward" then
                if facing == "east" then return { x = 1, y = 0, z = 0 } end
                if facing == "west" then return { x = -1, y = 0, z = 0 } end
                if facing == "north" then return { x = 0, y = 0, z = -1 } end
                if facing == "south" then return { x = 0, y = 0, z = 1 } end
            elseif movement == "back" then
                if facing == "east" then return { x = -1, y = 0, z = 0 } end
                if facing == "west" then return { x = 1, y = 0, z = 0 } end
                if facing == "north" then return { x = 0, y = 0, z = 1 } end
                if facing == "south" then return { x = 0, y = 0, z = -1 } end
            end
            return nil
        end)()

        if offset == nil then
            location.updateFromGPS()
        else
            location.applyOffset(offset)
        end

        local newPos = location.getPosition()
        if (newPos) then
            network.broadcastPacket({
                type = "response:position",
                position = newPos
            })
        end
        return success
    end
end

return exports
