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
        data[index] = {
            block = block.name,
            position = pos
        }
        foundPositions[vec3ToString(true)]
    end

    network.broadcastPacket({
        type = "response:scan",
        blocks = data,
        range= body.range
    })
end

---@param pos Vec3
---@return string
local function vec3ToString(pos) {
    return pos.x .. "," .. pos.y .. "," .. pos.z
}
