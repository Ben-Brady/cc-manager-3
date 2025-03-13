local network = require "network"
local location = require "device.location"

---@param body ScanRequest
return function(body)
    local scanner = peripheral.find("geoScanner")
    if scanner == nil then
        return
    end

    local position = location.getPosition()
    local blocks = scanner.scan(body.range)

    local data = {}
    for index, block in ipairs(blocks) do
        local pos = {
            x = block.x,
            y = block.y,
            z = block.z
        }
        data[#data + 1] = {
            name = block.name,
            offset = pos
        }
    end

    network.broadcastPacket({
        type = "response:scan",
        range = body.range,
        blocks = data,
        position = position
    })
end
