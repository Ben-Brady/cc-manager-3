local WS_SERVER = "ws://127.0.0.1:8000/ws/computer"
local PACKET_IN_PROTOCOL = "CCM3:packet-in"
local PACKET_OUT_PROTOCOL = "CCM3:packet-out"

local ws = http.websocket(WS_SERVER)
if not ws then error("Couldn't connect to server: " .. WS_SERVER) end

local modem = peripheral.find("modem")
if modem == nil then error("Modem not found") end
---@cast modem Modem
modem.open(rednet.CHANNEL_BROADCAST)
modem.open(os.getComputerID())

local function log(msg)
    print(os.date("%H:%M:%S") .. " | " .. msg)
end

local function proxyNextWebsocketPacket()
    local msg = ws.receive()
    if msg == nil then return end
    ---@cast msg string

    local packet = textutils.unserialiseJSON(msg)
    ---@cast packet RequestPacket
    local body = packet.body
    local dest = packet.destination

    if type(dest) == "number" then
        log("-" .. dest .. "> " .. body.type)
        rednet.send(dest, body, PACKET_IN_PROTOCOL)
    else
        log("-*> " .. body.type)
        rednet.broadcast(body, PACKET_IN_PROTOCOL)
    end
end

local function proxyNextComputerPacket()
    local sender, body = rednet.receive(PACKET_OUT_PROTOCOL)
    if sender == nil or body == nil then return end
    ---@cast body ResponseBody

    ---@type ResponsePacket
    local packet = {
        sender = sender,
        body = body,
    }

    local json = textutils.serializeJSON(packet, { allow_repetitions = true })
    log("<-- " .. body.type)
    ws.send(json, false)
end

local function pcall_log(callback)
    local success, msg = pcall(callback)
    if success then return end

    print(msg)
    if string.find(msg, "Terminated") then error(msg) end
    if string.find(msg, "attempt to use a closed file") then
        repeat
            os.startTimer(5)
            os.pullEvent("timer")
            ws = http.websocket(WS_SERVER)
        until ws ~= nil
    end
end

local function websocketProxyThread()
    while true do
        pcall_log(proxyNextWebsocketPacket)
    end
end

local function computerProxyThread()
    while true do
        pcall_log(proxyNextComputerPacket)
    end
end


parallel.waitForAny(computerProxyThread, websocketProxyThread)
