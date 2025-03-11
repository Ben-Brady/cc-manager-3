local events = require "threads.events"
local exports = {}
exports.heartbeatThread = require "threads.heartbeat"
exports.executionThread = require "threads.execution"
exports.listenerThread = require "threads.listener"
exports.peripheralAttachWatcherThread = events.listenForPeripheralAttach
exports.peripheralDetachWatcherThread = events.listenForPeripheralDetach
exports.inventoryUpdateWatcherThread = events.listenForInventoryUpdate
return exports
