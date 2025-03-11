local tasks   = require "tasks"
local network = require "network"
local utils   = require "utils"


local function acceptPacket()
    local task = network.getNextPacket()
    if task == nil then return end
    tasks.taskQueue[#tasks.taskQueue] = task
end


return function()
    while true do
        local success, msg = pcall(acceptPacket)
        if not success then print("Error: " .. msg) end
        utils.yield()
    end
end
