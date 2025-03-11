local modem = peripheral.find("modem")

return require "network.ws"
-- if modem == nil then
--     return require "network.ws"
-- else
--     return require "network.rednet"
-- end
