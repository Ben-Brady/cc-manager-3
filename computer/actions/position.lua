local network = require "network"
local location = require "device.location"

return function()
    local position = location.getPosition()
    if position == nil then
        return
    end

    network.broadcastPacket({
        type = "update:position",
        position = position
    })
end
