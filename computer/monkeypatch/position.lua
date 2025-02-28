local position = require "position"

local exports = {}

---@param func function
---@param movement "up" | "down" | "forward" | "back"
function exports.wrapMovementWithPositionUpdate(func, movement)
    return function()
        local success = func()
        if success then
            if movement == "up" then
                position.applyOffset({ x = 0, y = 1, z = 0 })
            elseif movement == "down" then
                position.applyOffset({ x = 0, y = -1, z = 0 })
            end
        end

        return success
    end
end

return exports
