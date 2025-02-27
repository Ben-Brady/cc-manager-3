local network = require "network"

---@param body EvalRequest
return function(body)
    local success, value = pcall(load(body.code))
    local json
    if value then json = textutils.serialiseJSON(value) end
    network.broadcastPacket({
        type = "response:eval",
        isError = success,
        value = json
    })
end
