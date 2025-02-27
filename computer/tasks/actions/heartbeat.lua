local network   = require "network"
local device    = require "device"
local inventory = require "turtle.inventory"

local start     = os.epoch("utc")
return function()
    local locks = require "tasks.locks"

    local uptimeMs = os.epoch("utc") - start
    local uptime = uptimeMs / 1000

    local label = os.getComputerLabel()
    local usedLocks = locks.getUsedLocks()

    local position = nil
    local x, y, z = gps.locate(0.1, false)
    if x ~= nil then
        position = { x = x, y = y, z = z }
    end

    local deviceType = device.getDeviceType()
    local deviceData = { type = deviceType }
    if deviceData.type == "turtle" then
        deviceData.inventory = inventory.getInventory()
        deviceData.selectedSlot = turtle.getSelectedSlot()
    end

    network.broadcastPacket({
        type = "response:heartbeat",
        label = label,
        uptime = uptime,
        deviceData = deviceData,
        position = position,
        locks = usedLocks,
    })
end
