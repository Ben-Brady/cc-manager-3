local network = require "network"


---@param body EvalRequest
return function(body)
    local func = load(body.code, "eval", "t", _G)
    local success, value = pcall(func)

    local json = nil
    if value then json = textutils.serialiseJSON(value) end

    network.broadcastPacket({
        type = "response:eval",
        isError = success,
        value = json
    })
end
