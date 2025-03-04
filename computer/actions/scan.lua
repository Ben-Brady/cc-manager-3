local network = require "network"
local location = require "location"

---@param body ScanRequest
return function(body)
    local scanner = peripheral.find("geoScanner")
    if scanner == nil then return end

    local position = location.getPosition()
    if position == nil then return end

    local blocks = scanner.scan(body.range)
    for index, block in ipairs(blocks) do
        network.broadcastPacket({
            type = "update:block-detection",
            block = block.name,
            position = {
                x = position.x + block.x,
                y = position.y + block.y,
                z = position.z + block.z,
            }
        })
    end
end
