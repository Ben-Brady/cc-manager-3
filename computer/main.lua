local threads = require "threads"
local network = require "network"
local loop = require "loop"
require "monkeypatch.direction"
require "monkeypatch.scan"
require "monitor"

network.setup()
loop.startThread(threads.executionThread)
loop.startThread(threads.heartbeatThread)
loop.startThread(threads.listenerThread)

loop.run()
