local heartbeat = require "actions.heartbeat"

local exports = {}

---@param func function
function exports.withSelectedSlotReport(func)
    return function(slot)
        local value = func(slot)
        heartbeat()
        return value
    end
end

return exports
