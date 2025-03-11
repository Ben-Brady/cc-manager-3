local loop = require "loop"
local threads = require "threads"
local network = require "network"
local location = require "location"
local monkeypatch = require "monkeypatch.init"

monkeypatch.patch()
network.setup()
location.updateFromGPS()

loop.startThread(threads.executionThread)
loop.startThread(threads.heartbeatThread)
loop.startThread(threads.listenerThread)
loop.startThread(threads.peripheralAttachWatcherThread)
loop.startThread(threads.peripheralDetachWatcherThread)
loop.startThread(threads.inventoryUpdateWatcherThread)

loop.run()
