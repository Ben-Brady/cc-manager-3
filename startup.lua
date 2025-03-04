local SERVER = "127.0.0.1:6543"
local FOLDER = "computer"
local PROGRAM_DIR = "program"

print("Loading...")

local url = "http://" .. SERVER .. "/" .. FOLDER
local r = http.get(url)
if r == nil then error("Failed to connect: " .. url) end

local json = r.readAll() or "{}"

local data = textutils.unserialiseJSON(json)
---@cast data table<string, string>

for filename, content in pairs(data) do
    filename = fs.combine(PROGRAM_DIR, filename)

    local folder = fs.getDir(filename)
    if not fs.exists(folder) then
        fs.makeDir(folder)
    end

    local f = fs.open(filename, "w")
    if f == nil then error("Failed to create: " .. filename) end
    f.write(content)
    f.close()
end

print("Starting...")
shell.setDir(PROGRAM_DIR)
shell.run("main.lua")
print("Program Stopped")
