local utils = require "utils"
local loop = require "loop"
local output = require "display.output"

local exports = {}

---@type Websocket
local ws

local function reconnect()
    while true do
        local WS_SERVER = "ws://127.0.0.1:8000/ws/computer"
        ws, error = http.websocket(WS_SERVER)
        if ws ~= false then
            output.log("Succesfully Connected")
            return
        end

        output.log("Reconnecting...")
        sleep(3)
    end
end

function exports.setup()
    reconnect()
end

---@return RequestBody | nil
function exports.getNextPacket()
    local success, msg = pcall(function()
        return ws.receive(0.2)
    end)

    if not success then
        reconnect()
        return
    end

    if msg == nil then
        return
    end
    ---@cast msg string

    local packet = textutils.unserialiseJSON(msg)
    ---@cast packet RequestPacket

    local isWildcard = packet.destination == "*"
    local isDM = packet.destination == os.getComputerID()
    if not (isWildcard or isDM) then
        return nil
    end

    output.logRequestPacket(packet)

    return packet.body
end

---@param body ResponseBody
function exports.broadcastPacket(body)
    ---@type ResponsePacket
    local packet = {
        sender = os.getComputerID(),
        body = body
    }

    local json = textutils.serializeJSON(packet, {
        allow_repetitions = true
    })
    local success = pcall(function()
        ws.send(json, false)
    end)
    if success then
        output.logResponsePacket(packet)
    else
        reconnect()
        exports.broadcastPacket(body)
    end
end

return exports
