local network   = require "network"
local device    = require "device"
local inventory = require "turtle.inventory"
local location  = require "location"

local start     = os.epoch("utc")
return function()
    local locks = require "tasks.locks"

    local uptimeMs = os.epoch("utc") - start
    local uptime = uptimeMs / 1000

    local label = os.getComputerLabel()
    local usedLocks = locks.getUsedLocks()

    local position = location.getPosition()

    local deviceType = device.getDeviceType()
    ---@type HeartbeatDeviceData
    local deviceData = { type = deviceType }
    if deviceData.type == "turtle" then
        deviceData.inventory = inventory.getInventory()
        deviceData.selectedSlot = turtle.getSelectedSlot()

        local fuel = turtle.getFuelLevel()
        if type(fuel) == "number" then
            deviceData.fuel = fuel
        else
            deviceData.fuel = math.maxinteger
        end
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
