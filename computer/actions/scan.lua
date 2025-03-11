local network = require "network"
local location = require "location"

---@param body ScanRequest
return function(body)
    local scanner = peripheral.find("geoScanner")
    if scanner == nil then return end

    local position = location.getPosition()
    if position == nil then return end

    local blocks = scanner.scan(body.range)

    local foundPositions = {}
    local data = {}
    for index, block in ipairs(blocks) do
        local pos = {
            x = position.x + block.x,
            y = position.y + block.y,
            z = position.z + block.z,
        }
        local key = tostring(pos.x) .. "," .. tostring(pos.y) .. "," .. tostring(pos.z)

        data[#data + 1] = {
            block = block.name,
            position = pos
        }
        foundPositions[key] = true
    end


    for x=-range + 1, body.range - 1, 1 do
        for y=-range + 1, body.range - 1, 1 do
            for z=-range + 1, body.range - 1, 1 do
                local pos = {
                    x = position.x + x,
                    y = position.y + y,
                    z = position.z + z,
                }
                local key = tostring(pos.x) .. "," .. tostring(pos.y) .. "," .. tostring(pos.z)

                if not foundPositions[key] then
                    data[#data + 1] = {
                        block = "minecraft:air",
                        position = pos
                    }
                end
            end
        end
    end

    network.broadcastPacket({
        type = "response:scan",
        blocks = data,
        range = body.range
    })
end
