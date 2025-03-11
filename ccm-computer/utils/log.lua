---@param msg string
return function(msg)
    print(os.date("%H:%M:%S") .. " | " .. msg)
end
