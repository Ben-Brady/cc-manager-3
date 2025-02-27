local network = require "network"
local rotation = require "rotation"

local function createInpect(func, direction)
    return function()
        local success, info = func()
        local block = success and info.name or "miencraft:air"
        network.broadcastPacket({
            type = "response:block-detection",
            direction = direction,
            block = block
        })
        return success, info
    end
end
turtle.inspect = createInpect(turtle.inspect, "front")
turtle.inspectUp = createInpect(turtle.inspectUp, "up")
turtle.inspectDown = createInpect(turtle.inspectDown, "down")

local turtleTurnRight = turtle.turnRight
turtle.turnRight = function ()
    turtleTurnRight()
    rotation.recordTurnRight()
end

local turtleTurnLeft = turtle.turnLeft
function turtle.turnLeft()
    turtleTurnLeft()
    rotation.recordTurnLeft()
end
