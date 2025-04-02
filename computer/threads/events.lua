local utils = require "utils"
local heartbeat = require "actions.heartbeat"

local exports = {}

---@param func function
local function loopEndless(func)
    while true do
        pcall(func)
        utils.yield()
    end
end

function exports.listenForPeripheralAttach()
    loopEndless(function ()
        os.pullEvent("peripheral")
        heartbeat()
    end)
end
function exports.listenForPeripheralDetach()
    loopEndless(function ()
        os.pullEvent("peripheral_detach")
        heartbeat()
    end)
end

function exports.listenForInventoryUpdate()
    loopEndless(function ()
        os.pullEvent("turtle_inventory")
        heartbeat()
    end)
end

return exports
