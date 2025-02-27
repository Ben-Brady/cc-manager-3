local utils = require "utils"
local exports = {}

local ws

function exports.setup()
    local WS_SERVER = "ws://localhost:8000/ws/computer"
    ws = http.websocket(WS_SERVER)
    if not ws then error("Couldn't connect to server: " .. WS_SERVER) end
end

---@return RequestBody | nil
function exports.getNextPacket()
    local msg = ws.receive()
    if msg == nil then return end
    ---@cast msg string

    local packet = textutils.unserialiseJSON(msg)
    ---@cast packet RequestPacket
    utils.log("<- " .. packet.body.type)

    return packet.body
end

---@param body ResponseBody
function exports.broadcastPacket(body)
    utils.log("-> " .. body.type)
    ---@type ResponsePacket
    local packet = {
        sender = os.getComputerID(),
        body = body,
    }

    local json = textutils.serializeJSON(packet, { allow_repetitions = true })
    ws.send(json, false)
end

return exports
