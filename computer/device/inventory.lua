local exports = {}

---@return ItemSlot[]
function exports.getInventory()
    ---@type ItemSlot[]
    local items = {}

    for i = 1, 16, 1 do
        local detail = turtle.getItemDetail(i, false)
        if detail then
            items[i] = {
                name = detail.name,
                count = detail.count
            }
        else
            items[i] = "empty"
        end
    end

    return items
end

return exports
