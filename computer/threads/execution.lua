local tasks = require "tasks"
local locks = require "locks"
local loop  = require "loop"
local utils = require "utils"
local output = require "display.output"

local function runNextTask()
    for index, task in pairs(tasks.taskQueue) do
        local taskDesc = tasks.getTaskInfo(task.type)

        local taskLocks
        if task.type == "request:eval" then
            taskLocks = task.locks
        else
            taskLocks = taskDesc.locks
        end


        local canRun = locks.isLocksAvailable(taskLocks)
        if canRun then
            table.remove(tasks.taskQueue, index)
            locks.aquireLocks(taskLocks)
            loop.startThread(function()
                local success, msg = pcall(function() taskDesc.execute(task) end)

                if not success then
                    output.log("Error: " .. msg)
                end
                locks.releaseLocks(taskLocks)
            end)
        end
    end
end

return function()
    while true do
        pcall(runNextTask)
        utils.yield()
    end
end
