local exports = {}

---@type Vec3 | nil
local position = nil

local x, _ = gps.locate(1, false)
exports.hasGPS = x ~= nil

---@param newPos Vec3
function exports.updatePostion(newPos)
    position = newPos
end

---@return Vec3|nil
function exports.getPosition()
    -- if position == nil then
    --     exports.updateFromGPS()
    -- end
    exports.updateFromGPS()
    return position
end

function exports.updateFromGPS()
    if not exports.hasGPS then return end
    local x, y, z = gps.locate(0.5, false)
    position = { x = x, y = y, z = z }
end

---@param offset Vec3
function exports.applyOffset(offset)
    if position == nil then return end

    position = {
        x = position.x + offset.x,
        y = position.y + offset.y,
        z = position.z + offset.z
    }
end

return exports
