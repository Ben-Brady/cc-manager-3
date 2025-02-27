---@meta

---@class RequestPacket
---@field destination number | "*"
---@field body RequestBody

---@class ResponsePacket
---@field sender number
---@field body ResponseBody

---@alias RequestBody
--- | HeartbeatRequest
--- | RestartRequest
--- | EvalRequest
--- | RotationRequest

---@alias ResponseBody
--- | HeartbeatResponse
--- | EvalResponse
--- | BlockDetectionResponse
--- | RotationResponse

---@class RestartRequest
---@field type "request:restart"

---@class EvalRequest
---@field type "request:eval"
---@field code string
---@field locks LockType[]

---@class EvalResponse
---@field type "response:eval"
---@field value string
---@field isError boolean

---@class BlockDetectionResponse
---@field type "response:block-detection"
---@field direction "up" | "down" | "front"
---@field block string

---@class RotationRequest
---@field type "request:rotation"

---@class RotationResponse
---@field type "response:rotation"
---@field facing "east" | "west" | "north" | "south"

---@class HeartbeatRequest
---@field type "request:heartbeat"

---@class HeartbeatResponse
---@field type "response:heartbeat"
---@field label string | nil
---@field uptime number
---@field position Vec3 | nil
---@field locks LockType[]
---@field tasks RequestBody[]
---@field deviceData DeviceHeartbeatData

---@alias DeviceType "computer" | "pocket" | "turtle"
---@alias DeviceHeartbeatData ComputerHeartbeatData | PocketHeartbeatData | TurtleHeartbeatData

---@class ComputerHeartbeatData
---@field type "computer"

---@class PocketHeartbeatData
---@field type "pocket"

---@class TurtleHeartbeatData
---@field type "turtle"
---@field inventory table<number, ItemSlot>
---@field selectedSlot number
---@field leftHand ItemSlot
---@field rightHand ItemSlot

---@class Vec3
---@field x number
---@field y number
---@field z number

---@class Item
---@field name string
---@field count number

---@alias ItemSlot Item | nil
