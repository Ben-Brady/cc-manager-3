local network = require "network"
local globals = require "device.globals"

local exports = {}

---@param item turtleDetailsDetailed | nil
---@return HeldItem
local function getItemType(item)
    if item == nil then
        return "empty"
    end

    ---@type table<string, HeldItem>
    local lookup = {}
    lookup["minecraft:diamond_pickaxe"] = "pickaxe"
    lookup["minecraft:diamond_axe"] = "axe"
    lookup["minecraft:diamond_shovel"] = "shovel"
    lookup["minecraft:diamond_hoe"] = "hoe"
    lookup["minecraft:diamond_sword"] = "sword"
    lookup["minecraft:crafting_table"] = "crafting_table"
    lookup["computercraft:speaker"] = "speaker"
    lookup["computercraft:wireless_modem_normal"] = "wireless_modem"
    lookup["computercraft:wireless_modem_advanced"] = "ender_modem"
    lookup["advancedperipherals:geo_scanner"] = "ap:geoscanner"

    return lookup[item.name] or "unknown_item"
end

---@param func fun(): boolean, string|nil
---@param side "left" | "right"
---@return fun(): boolean, string|nil
function exports.withEquipUpdate(func, side)
    return function()
        local slot = turtle.getSelectedSlot()
        local item = turtle.getItemDetail(slot, true)
        local heldName = getItemType(item)

        local success, message = func()
        if success then
            if side == "left" then
                globals.leftItem = heldName
                network.broadcastPacket({
                    type = "update:equipped",
                    side = "left",
                    item = heldName
                })
            else
                globals.rightItem = heldName
                network.broadcastPacket({
                    type = "update:equipped",
                    side = "right",
                    item = heldName
                })
            end
        end

        return success, message
    end
end

return exports
