local network   = require "network"
local inventory = require "device.inventory"

return function()
    network.broadcastPacket({
        type = "update:inventory",
        inventory = inventory.getInventory(),
    })
end
