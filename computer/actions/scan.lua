local network = require "network"
local location = require "location"

---@param body ScanRequest
return function(body)
    local scanner = peripheral.find("geoScanner")
    if scanner == nil then return end

    local position = location.getPosition()
    if position == nil then return end


    local blocks = scanner.scan(body.range)

    local data = {}
    for index, block in ipairs(blocks) do
        data[index] = {
            block = block.name,
            position = {
                x = position.x + block.x,
                y = position.y + block.y,
                z = position.z + block.z,
            }
        }
    end

    network.broadcastPacket({
        type = "response:scan",
        blocks = data
    })
end
