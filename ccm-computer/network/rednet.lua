local constants = require "constants"
local utils     = require "utils"
local device    = require "device"

local exports   = {}

function exports.setup()
    local type = device.getDeviceType()
    rednet.open(type == "turtle" and "left" or "back")
end

---@param packet ResponseBody
function exports.broadcastPacket(packet)
    utils.log("-> " .. packet.type)
    rednet.broadcast(packet, constants.PACKET_OUT_PROTOCOL)
end

---@return RequestBody
function exports.getNextPacket()
    local _, body = rednet.receive(constants.PACKET_IN_PROTOCOL)
    ---@cast body RequestBody
    utils.log("<- " .. body.type)
    return body
end

return exports
