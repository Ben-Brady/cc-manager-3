local loop = require "loop"
local utils = require "utils"
local threads = require "threads"
local network = require "network"
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
loop.startThread(threads.peripheralAttachWatcherThread)
loop.startThread(threads.peripheralDetachWatcherThread)
loop.startThread(threads.inventoryUpdateWatcherThread)

loop.startThread(function()
    utils.interval(2.5, heartbeat)
end)

if deviceType.getDeviceType() == "pocket" then
    loop.startThread(function()
        utils.interval(0.2, position)
    end)
    loop.startThread(function()
        utils.interval(0.2, position)
    end)
end

loop.run()
