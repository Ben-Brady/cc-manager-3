local utils = require("utils")
local windows = require("display.windows")
local displayutils = require("display.displayutils")

local exports = {}

local start = os.epoch("utc")

---@return string
local function timestamp()
    if pocket then
        return tostring(os.date("%M:%S"))
    end

    local clock = (os.epoch("utc") - start) / 1000
    local timestamp = tostring(utils.round(clock, 2))
    return utils.rpad(timestamp, 7, "0")
end

---@param packet RequestPacket|ResponsePacket
local function getPacketType(packet)
    if packet.body.type == "request:eval" or packet.body.type == "response:eval" then
        return packet.body.type .. ":" .. packet.body.id
    end

    return packet.body.type
end

---@param packet RequestPacket
function exports.logRequestPacket(packet)
    local w = windows.networkWindow
    local msg = timestamp() .. " | <- " .. getPacketType(packet)
    w.scroll(-1)
    w.setCursorPos(1, 1)
    w.write(msg)
end

---@param packet ResponsePacket
function exports.logResponsePacket(packet)
    local w = windows.networkWindow

    local msg = timestamp() .. " | -> " .. getPacketType(packet)
    w.scroll(-1)
    w.setCursorPos(1, 1)
    w.write(msg)
end

---@param msg string
function exports.log(msg)
    local w = windows.logWindow
    w.scroll(-1)
    w.setCursorPos(1, 1)
    w.write(msg)
end

return exports
