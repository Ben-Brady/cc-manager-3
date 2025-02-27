local monitor = peripheral.find("monitor")
---@cast monitor Monitor | nil

if monitor then
    monitor.setTextScale(0.5)
    term.redirect(monitor)
    term.clear()
    term.setCursorPos(0, 0)
    term.setCursorBlink(false)
end
