local heartbeat = require "actions.heartbeat"
local restart = require "actions.restart"
local eval = require "actions.eval"

---@class TaskInfo
---@field type ComputerTaskType
---@field execute function
---@field locks LockType[]

---@type TaskInfo[]
return {
    {
        type = "request:heartbeat",
        execute = heartbeat,
        locks = {},
    },
    {
        type = "request:restart",
        execute = restart,
        locks = { "movement" },
    },
    {
        type = "request:eval",
        execute = eval,
        locks = {},
    },
}
