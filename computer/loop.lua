local exports = {}

local threads = {}

---@param fn function
function exports.startThread(fn)
    if type(fn) ~= "function" then
        error("bad argument #fn (function expected, got " .. type(fn) .. ")", 3)
    end

    threads[#threads + 1] = {
        co = coroutine.create(fn),
        filter = nil
    }
end

function exports.run()
    local count = #threads
    if count < 1 then return 0 end

    local event = { n = 0 }
    while true do
        for i, thread in ipairs(threads) do
            local hasNoFilter = thread.filter == nil
            local filterIsTarget = thread.filter == event[1]
            local filterIsTerminate = event[1] == "terminate"
            if thread and (hasNoFilter or filterIsTarget or filterIsTerminate) then
                local ok, param = coroutine.resume(thread.co, table.unpack(event, 1, event.n))

                if ok then
                    thread.filter = param
                else
                    error(param, 0)
                end

                if coroutine.status(thread.co) == "dead" then
                    table.remove(threads, i)
                end

                if #threads == 0 then
                    return
                end
            end
        end

        event = table.pack(os.pullEventRaw())
    end
end

return exports
