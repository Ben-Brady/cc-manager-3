local utils = require "utils"
local exports = {}

local ws

local function reconnect()
    while true do
        local WS_SERVER = "ws://127.0.0.1:8000/ws/computer"
        ws, error = http.websocket(WS_SERVER)
        if ws ~= false then
            return
        end

        utils.log("Reconnecting...")
        sleep(3)
    end
end

function exports.setup()
    reconnect()
end

---@return RequestBody | nil
function exports.getNextPacket()
    local success, msg = pcall(function()
        return ws.receive()
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

    utils.log("<- " .. packet.body.type)

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
        utils.log("-> " .. body.type)
    else
        reconnect()
    end
end

return exports
