local exports = {}

function exports.yield()
    sleep(0.05)
end

local start = os.epoch("utc")
---@param msg string
function exports.log(msg)
    if pocket then
        print(os.date("%M:%S") .. "| " .. msg)
    else
        -- print(os.date("%H:%M:%S") .. " | " .. msg)
        local clock = os.epoch("utc") - start
        print((clock / 1000) .. " | " .. msg)
    end
end

---@param time number
---@param callback function
function exports.interval(time, callback)
    while true do
        local startTime = os.clock()
        callback()
        local endTime = os.clock()
        local duration = endTime - startTime
        sleep(time - duration)
    end
end

return exports
