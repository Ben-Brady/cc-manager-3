local export = {}

---@return DeviceType
function export.getDeviceType()
    if turtle then
        return "turtle"
    elseif pocket then
        return "pocket"
    else
        return "computer"
    end
end

return export
