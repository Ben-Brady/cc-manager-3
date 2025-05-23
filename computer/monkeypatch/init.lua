local direction = require "monkeypatch.direction"
local scan = require "monkeypatch.scan"
local position = require "monkeypatch.position"
local inventory = require "monkeypatch.inventory"
local equip = require "monkeypatch.equip"

return {
    patch = function()
        if turtle then
            turtle.equipLeft = equip.withEquipUpdate(turtle.equipLeft, "left")
            turtle.equipRight = equip.withEquipUpdate(turtle.equipRight, "right")

            turtle.inspect = scan.withInspectReport(turtle.inspect, "front")
            turtle.inspectUp = scan.withInspectReport(turtle.inspectUp, "up")
            turtle.inspectDown = scan.withInspectReport(turtle.inspectDown, "down")

            turtle.dig = scan.withDigUpdate(turtle.dig, "front")
            turtle.digUp = scan.withDigUpdate(turtle.digUp, "up")
            turtle.digDown = scan.withDigUpdate(turtle.digDown, "down")

            ---- Rotation
            -- 1st Executed
            turtle.turnLeft = direction.turnWithRotationUpdate(turtle.turnLeft, "left")
            turtle.turnRight = direction.turnWithRotationUpdate(turtle.turnRight, "right")

            -- 2nd Executed
            turtle.turnLeft = scan.withTurnScan(turtle.turnLeft)
            turtle.turnRight = scan.withTurnScan(turtle.turnRight)

            ---- Movement
            -- 1st Executed
            turtle.forward = direction.fowardWithRotationCalibration(turtle.forward)
            turtle.back = direction.backWithRotationCalibration(turtle.back)

            -- 2nd Executed
            turtle.forward = position.withPositionUpdate(turtle.forward, "forward")
            turtle.back = position.withPositionUpdate(turtle.back, "back")
            turtle.up = position.withPositionUpdate(turtle.up, "up")
            turtle.down = position.withPositionUpdate(turtle.down, "down")

            -- 3rd Executed
            turtle.forward = scan.withMovementScan(turtle.forward)
            turtle.back = scan.withMovementScan(turtle.back)
            turtle.up = scan.withMovementScan(turtle.up)
            turtle.down = scan.withMovementScan(turtle.down)

            -- turtle.select = inventory.withSelectedSlotReport(turtle.select)
        end
    end
}
