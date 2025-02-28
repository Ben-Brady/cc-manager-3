local network = require "network"
local rotation = require "rotation"

return function()
    local facing = rotation.getRotation()
    if facing == nil then
        facing = rotation.calibrate()
        if facing == nil then return end
    end

    network.broadcastPacket({
        type = "response:rotation",
        facing = facing,
    })
end
