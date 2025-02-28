---@param info inspectInfo | nil | unknown
local function isOre(info)
    if info == nil then return false end
    if info.name == nil then return false end

    if string.find(info.name, "ore") then
        return true
    else
        return false
    end
end

---@param length number
local function tunnelForward(length)
    for i = 1, length, 1 do
        while turtle.detect() do turtle.dig() end
        turtle.forward()

        local _, blockUp = turtle.inspectUp()
        local _, blockDown = turtle.inspectDown()

        if (isOre(blockUp)) then turtle.digUp() end
        if (isOre(blockDown)) then turtle.digDown() end
    end
end

local WIDTH = 64
local DEPTH = 64
for i = 1, WIDTH, 1 do
    tunnelForward(DEPTH)
    turtle.turnRight()
    while turtle.detect() do turtle.dig() end
    turtle.forward()
    turtle.turnRight()
    while turtle.detectUp() do turtle.digUp() end
    turtle.digUp()
    turtle.up()

    tunnelForward(DEPTH)
    turtle.turnLeft()
    while turtle.detect() do turtle.dig() end
    turtle.forward()
    turtle.turnLeft()
    while turtle.detectDown() do turtle.digDown() end
    turtle.down()
end

turtle.turnLeft()
for i = 1, WIDTH, 1 do
    turtle.dig()
    turtle.forward()
end
