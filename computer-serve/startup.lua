local SERVER = "127.0.0.1:6543"
local FOLDER = "computer"
local FORCE_DOWNLOAD = true

local url = "http://" .. SERVER .. "/" .. FOLDER
print(url)

local function download()
    local r = http.get(url)
    if r == nil then
        return false
    end

    local json = r.readAll()
    local data = textutils.unserialiseJSON(json)
    ---@cast data table<string, string>

    fs.delete(FOLDER)
    for filename, content in pairs(data) do
        filename = fs.combine(FOLDER, filename)

        local folder = fs.getDir(filename)
        if not fs.exists(folder) then
            fs.makeDir(folder)
        end

        local f = fs.open(filename, "w")
        if f == nil then
            error("Failed to create: " .. filename)
        end
        f.write(content)
        f.close()
    end

    return true
end

if FORCE_DOWNLOAD then
    local success
    repeat
        success = download()
        if not success then
            print("Download Failed, Trying Again...")
            sleep(5)
        end
    until success
else
    local success = download()
    if not success then
        print("Download Failed")
    end
end

print("Starting...")
shell.setDir(FOLDER)
shell.run("main.lua")
print("Program Stopped")
