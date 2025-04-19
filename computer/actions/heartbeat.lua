local network   = require "network"
local device    = require "device.type"
local inventory = require "device.inventory"
local location  = require "device.location"
local globals   = require "device.globals"
local output    = require "display.output"

local start     = os.epoch("utc")

return function()
    local locks = require "locks"

    local uptimeMs = os.epoch("utc") - start
    local uptime = uptimeMs / 1000

    local label = os.getComputerLabel()
    local usedLocks = locks.getUsedLocks()
    local position = location.getPosition()
    local deviceType = device.getDeviceType()
    ---@type HeartbeatDeviceData
    local deviceData = {
        type = deviceType
    }

    if deviceData.type == "turtle" then
        deviceData.inventory = inventory.getInventory()
        deviceData.selectedSlot = turtle.getSelectedSlot()
        deviceData.leftHand = globals.leftItem
        deviceData.rightHand = globals.rightItem

        local fuel = turtle.getFuelLevel()
        if type(fuel) == "number" then
            deviceData.fuel = fuel
        else -- Infinite Fuel
            deviceData.fuel = math.maxinteger
        end
    end

    network.broadcastPacket({
        type = "response:heartbeat",
        label = label,
        uptime = uptime,
        deviceData = deviceData,
        locks = usedLocks,
        position = position,
    })
end
