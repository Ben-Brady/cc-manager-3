local descriptors = require "tasks.descriptors"
local exports     = {}

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
