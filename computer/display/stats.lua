local windows = require "display.windows"
local colors  = require "display.colors"
local globals = require "device.globals"
local tasks   = require "tasks"
local locks   = require "locks"
local exports = {}


local w     = windows.statsWindow
local WIDTH = w.getSize()

local function blankScrean()
    local width, height = w.getSize()
    local old = term.current()
    term.redirect(w)
    paintutils.drawFilledBox(1, 1, width, height)
    term.redirect(old)
end

local function getPosition()
    local pos = globals.position
    if pos then
        return pos.x .. "," .. pos.y .. "," .. pos.z
    else
        return "?,?,?"
    end
end

local function firstLine()
    local id = os.getComputerID()
    local label = os.getComputerLabel()
    local position = getPosition()
    local rotation = globals.facing or "?"
    local text = label .. "(" .. id .. ") | " .. position .. " | " .. rotation

    w.setCursorPos(1, 1)
    w.write(text)
end

local function secondLine()
    local left = globals.leftItem or "?"
    local right = globals.rightItem or "?"
    local handText = left .. " | " .. right

    local taskCount = #tasks.taskQueue
    local taskCountText = taskCount .. " Tasks"

    local paddingLength = WIDTH - #handText - #taskCountText
    local padding = string.rep(" ", paddingLength)

    w.setCursorPos(1, 2)
    w.write(handText .. padding .. taskCountText)
end

local function thirdLine()
    w.setCursorPos(1, 3)
    for key, value in pairs(locks.locks) do
        if (value == "locked") then
            w.write(key .. " ")
        end
    end
end

function exports.updateStats()
    blankScrean()
    firstLine()
    secondLine()
    thirdLine()
end

return exports
