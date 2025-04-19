local loop = require "loop"
local exports = {}

function exports.yield()
    local id = tostring(math.random(50000))
    local event = "yield:" .. id
    os.queueEvent(event)
    os.pullEvent(event)
end

--- @param str string
--- @param length string
--- @param char string
--- @return string
function exports.rpad(str, length, char)
    if char == nil then char = ' ' end
    return string.rep(char, length - #str) .. str
end

--- @param str string
--- @param length string
--- @param char string
--- @return string
function exports.lpad(str, length, char)
    if char == nil then char = ' ' end
    return str .. string.rep(char, length - #str)
end

---@param num number
---@param places number
---@return number
function exports.round(num, places)
    local mult = 10 ^ (places or 0)
    return math.floor(num * mult + 0.5) / mult
end

---@param time number
---@param callback function
function exports.interval(time, callback)
    loop.startThread(function()
        while true do
            local startTime = os.clock()
            callback()
            local endTime = os.clock()
            local duration = endTime - startTime
            sleep(time - duration)
        end
    end)
end

return exports
