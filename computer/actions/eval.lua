local network = require "network"


---@param body EvalRequest
return function(body)
    local func = load(body.code, "eval", "t", _G)
    local success, value = pcall(func)

    if not success then
        network.broadcastPacket({
            type = "response:eval",
            id = body.id,
            isError = true,
            value = value
        })
    else
        local json = nil
        if value then
            json = textutils.serialiseJSON(value)
        end

        network.broadcastPacket({
            type = "response:eval",
            id = body.id,
            isError = false,
            value = json
        })
    end
end
