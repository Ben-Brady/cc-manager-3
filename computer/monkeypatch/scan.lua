local network = require "network"
local autoscan = require "autoscan"
local heartbeat = require "tasks.actions.heartbeat"

local exports = {}

function exports.wrapInspectWithScan(func, direction)
    return function()
        local success, info = func()
        local block = success and info.name or "minecraft:air"
        network.broadcastPacket({
            type = "response:block-detection",
            direction = direction,
            block = block
        })
        return success, info
    end
end

function exports.wrapMovementWithScan(func)
    return function()
        local success = func()
        if autoscan.enabled then
            heartbeat()
            autoscan.scan()
        end
        return success
    end
end

return exports
