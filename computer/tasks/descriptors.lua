local heartbeat = require "tasks.actions.heartbeat"
local restart = require "tasks.actions.restart"
local eval = require "tasks.actions.eval"
local rotation = require "tasks.actions.rotation"

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
    {
        type = "request:rotation",
        execute = rotation,
        locks = { "movement" },
    }
}
