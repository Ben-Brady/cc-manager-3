local utils     = require "utils"
local heartbeat = require "actions.heartbeat"
local globals   = require "device.globals"
local network   = require "network"
local inventory = require "actions.inventory"

local exports   = {}

---@param func function
local function loopEndless(func)
    while true do
        pcall(func)
        utils.yield()
    end
end


function exports.listenForInventoryUpdate()
    loopEndless(function()
        os.pullEvent("turtle_inventory")
        inventory()
    end)
end

return exports
