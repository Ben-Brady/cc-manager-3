local exports = {}

---@param w Window
---@param msg string
function exports.windowPrint(w, msg)
    local old = term.current()
    term.redirect(w)
    print(msg)
    term.redirect(old)
end

return exports
