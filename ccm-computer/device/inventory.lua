local exports = {}

---@type ItemSlot[]
function exports.getInventory()
    local inventory = {}

    for i = 1, 16, 1 do
        local detail = turtle.getItemDetail(i, false)
        if detail then
            inventory[i] = {
                name = detail.name,
                count = detail.count
            }
        end
    end

    return inventory
end

return exports
