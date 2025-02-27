local utils = require "utils"
local constants = require "constants"
local heartbeat = require "tasks.actions.heartbeat"

return function()
    utils.interval(constants.HEARTBEAT_INTERVAL, heartbeat)
end
