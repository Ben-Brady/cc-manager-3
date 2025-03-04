local heartbeat = require "actions.heartbeat"
local restart = require "actions.restart"
local eval = require "actions.eval"
local scan = require "actions.scan"

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
        type = "request:scan",
        execute = scan,
        locks = {},
    },
}
