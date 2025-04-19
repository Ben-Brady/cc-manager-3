local deviceType = require "device.type"
local globals = require "device.globals"

local exports = {}

local gpsX, _ = gps.locate(1, false)

---@return Vec3|nil
function exports.getPosition()
    if deviceType.getDeviceType() ~= "turtle" then
        exports.updateFromGPS()
        return globals.position
    else
        if globals.position == nil then
            exports.updateFromGPS()
        end

        return globals.position
    end
end

function exports.updateFromGPS()
    local x, y, z = gps.locate(0.5, false)
    globals.position = {
        x = x,
        y = y,
        z = z
    }
end

---@param offset Vec3
function exports.applyOffset(offset)
    local position = globals.position
    if position == nil then
        return
    end

    globals.position = {
        x = position.x + offset.x,
        y = position.y + offset.y,
        z = position.z + offset.z
    }
end

return exports
