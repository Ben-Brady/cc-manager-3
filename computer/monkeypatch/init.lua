local direction = require "monkeypatch.direction"
local scan = require "monkeypatch.scan"
local position = require "monkeypatch.position"

turtle.turnRight = direction.wrapTurnWithReport(turtle.turnRight, "right")
turtle.turnLeft = direction.wrapTurnWithReport(turtle.turnLeft, "left")
turtle.forward = direction.wrapMoveWithCalibration(turtle.forward)
turtle.back = direction.wrapMoveWithCalibration(turtle.back)

turtle.inspect = scan.wrapInspectWithScan(turtle.inspect, "front")
turtle.inspectUp = scan.wrapInspectWithScan(turtle.inspectUp, "up")
turtle.inspectDown = scan.wrapInspectWithScan(turtle.inspectDown, "down")

turtle.forward = scan.wrapMovementWithScan(turtle.forward)
turtle.back = scan.wrapMovementWithScan(turtle.back)
turtle.up = scan.wrapMovementWithScan(turtle.up)
turtle.down = scan.wrapMovementWithScan(turtle.down)

