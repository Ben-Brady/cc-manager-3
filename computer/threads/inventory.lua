local utils = require "utils"
local heartbeat = require "actions.heartbeat"

local function runNextTask()
    os.pullEvent("turtle_inventory")
    heartbeat()
end

return function()
    while true do
        pcall(runNextTask)
        utils.yield()
    end
end
