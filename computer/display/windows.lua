local displayutils = require "display.displayutils"
local colors = require "display.colors"
local exports = {}

local termWidth, termHeight = term.getSize()
local y = 1

---@param height number
---@param textColor number
---@param bgColor number
---@return Window
local function createNewWindow(height, textColor, bgColor)
    local w = window.create(term.current(), 1, y, termWidth, height)

    w.setTextColor(textColor)
    w.setBackgroundColor(bgColor)

    local old = term.current()
    term.redirect(w)
    paintutils.drawFilledBox(1, 1, termWidth, height, bgColor)
    term.redirect(old)

    y = y + height
    return w
end

---@param char string
---@param textColor number
---@param bgColor number
local function createSpacer(char, textColor, bgColor)
    local w = createNewWindow(1, textColor, bgColor)
    w.setCursorPos(1, 1)
    w.write(string.rep(char, termWidth))
end

exports.statsWindow = createNewWindow(3, colors.text, colors.surface_1)
exports.networkWindow = createNewWindow(7, colors.blue, colors.surface_0)
exports.logWindow = createNewWindow(4, colors.blue, colors.surface_0)


return exports
