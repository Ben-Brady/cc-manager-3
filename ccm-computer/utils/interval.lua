---@param time number
---@param callback function
---@return function cancel
return function(time, callback)
    while true do
        local startTime = os.clock()
        callback()
        local endTime = os.clock()
        local duration = endTime - startTime
        sleep(time - duration)
    end
end
