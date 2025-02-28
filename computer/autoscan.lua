local exports = {}

exports.enabled = true

function exports.scan()
    turtle.inspect()
    turtle.inspectUp()
    turtle.inspectDown()
end

return exports
