local exports = {}

exports.enabled = false

function exports.scan()
    turtle.inspect()
    turtle.inspectUp()
    turtle.inspectDown()
end

return exports
