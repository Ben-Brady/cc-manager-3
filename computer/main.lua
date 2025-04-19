local monitor = peripheral.find("monitor")
if monitor then
    monitor.setTextScale(0.5)
    term.redirect(monitor)
end

local loop = require "loop"
local utils = require "utils"
local threads = require "threads"
local network = require "network"
local stats = require "display.stats"
local location = require "device.location"
local deviceType = require "device.type"
local heartbeat = require "actions.heartbeat"
local position = require "actions.position"
local monkeypatch = require "monkeypatch.init"

monkeypatch.patch()
network.setup()
location.updateFromGPS()

loop.startThread(threads.executionThread)
loop.startThread(threads.listenerThread)
loop.startThread(threads.inventoryUpdateWatcherThread)

-- utils.interval(2, heartbeat)
utils.interval(0.25, stats.updateStats)

if deviceType.getDeviceType() == "pocket" then
    loop.startThread(function()
        utils.interval(0.2, position)
    end)
end

loop.run()
