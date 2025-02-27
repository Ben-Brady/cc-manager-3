local exports = {}

---@alias Rotation "east" | "west" | "north" | "south"

---@type Rotation | nil
local rotation = nil

---@return Rotation | nil
function exports.getRotation()
    return rotation
end

---@return Rotation | nil
local function calculateRotation()
    local xOld, _, zOld = gps.locate(0.1, false)
    local success = turtle.forward()
    if not success then
        return nil
    end
    local xNew, _, zNew = gps.locate(0.1, false)

    if zOld == zNew then
        if zNew > zOld then
            return "south"
        else
            return "north"
        end
    else
        if xNew > xOld then
            return "east"
        else
            return "west"
        end
    end
end

---@return Rotation | nil
function exports.calibrate()
    local newRotation = calculateRotation()
    if newRotation ~= nil then
        rotation = newRotation
    end
    return newRotation
end

function exports.recordTurnLeft()
    if exports.rotation == nil then return end

    if (exports.rotation == "north") then
        exports.rotation = "west"
    elseif (exports.rotation == "west") then
        exports.rotation = "south"
    elseif (exports.rotation == "south") then
        exports.rotation = "east"
    elseif (exports.rotation == "east") then
        exports.rotation = "north"
    end
end

function exports.recordTurnRight()
    if exports.rotation == nil then return end

    if (exports.rotation == "north") then
        exports.rotation = "east"
    elseif (exports.rotation == "east") then
        exports.rotation = "south"
    elseif (exports.rotation == "south") then
        exports.rotation = "west"
    elseif (exports.rotation == "west") then
        exports.rotation = "north"
    end
end

return exports
