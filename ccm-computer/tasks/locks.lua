local export = {}

---@alias LockType
--- | "inventory"
--- | "movement"

---@type table<LockType, "free" | "locked">
export.locks = {
    inventory = "free",
    movement = "free",

}
---@type table<LockType, "free" | "locked">
export.locks = {
    inventory = "free",
    movement = "free",
}

---@return LockType[]
function export.getUsedLocks()
    local locks = {}

    for key, lock in pairs(export.locks) do
        if (lock == "locked") then
            locks[#locks + 1] = key
        end
    end

    if #locks == 0 then
        return textutils.empty_json_array
    else
        return locks
    end
end

---@param locks LockType[]
function export.aquireLocks(locks)
    if not export.isLocksAvailable(locks) then
        error("Locks not available")
    end

    for _, lock in pairs(locks) do
        export.locks[lock] = "locked"
    end
end

---@param locks LockType[]
function export.releaseLocks(locks)
    for _, lock in pairs(locks) do
        export.locks[lock] = "free"
    end
end

---@param locks LockType[]
function export.isLocksAvailable(locks)
    for _, lock in pairs(locks) do
        if export.locks[lock] == "locked" then
            return false
        end
    end

    return true
end

return export
