local threads = require "threads"
local network = require "network"
local loop = require "loop"
require "monkeypatch"
require "monitor"

network.setup()
loop.startThread(threads.executionThread)
loop.startThread(threads.heartbeatThread)
loop.startThread(threads.listenerThread)

loop.run()
