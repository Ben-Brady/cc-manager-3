local exports = {}

function exports.yield()
    sleep(0.05)
end

exports.interval = require("utils.interval")
exports.log = require("utils.log")

return exports
