local heartbeat = require "actions.heartbeat"
local restart = require "actions.restart"
local eval = require "actions.eval"
local scan = require "actions.scan"

local exports = {}

---@class TaskInfo
---@field type ComputerTaskType
---@field execute function
---@field locks LockType[]

---@type TaskInfo[]
local descriptors = {{
    type = "request:heartbeat",
    execute = heartbeat,
    locks = {}
}, {
    type = "request:restart",
    execute = restart,
    locks = {"movement"}
}, {
    type = "request:eval",
    execute = eval,
    locks = {}
}, {
    type = "request:scan",
    execute = scan,
    locks = {}
}}

---@type Task[]
exports.taskQueue = {}

---@param type ComputerTaskType
function exports.getTaskInfo(type)
    for _, value in pairs(descriptors) do
        if value.type == type then
            return value
        end
    end

    error("Could not find task: " .. type)
end

return exports
