---@meta

---@alias ComputerTaskType "request:heartbeat" | "request:restart" | "request:eval" | "request:scan"
---@alias Task HeartbeatRequest | EvalRequest | RestartRequest
---@alias NaiveTask HeartbeatRequest

---@meta
---@alias LockType "movement" | "inventory"
---@alias RequestBody HeartbeatRequest | RestartRequest | EvalRequest | ScanRequest
---@alias ResponseBody HeartbeatResponse | EvalResponse | BlockDetectionResponse | RotationResponse | PositionResponse | InventoryResponse | ScanResponse | EquippedResponse

---@class ScanRequest
---@field type "request:scan"
---@field range number

---@class ScanResponse
---@field type "response:scan"
---@field range number
---@field position Vec3|nil
---@field blocks ScanResponseBlock[]

---@class ScanResponseBlock
---@field name string
---@field offset Vec3

---@class EvalRequest
---@field type "request:eval"
---@field id string
---@field code string
---@field locks LockType[]

---@class EvalResponse
---@field type "response:eval"
---@field id string
---@field value string | nil
---@field isError boolean

---@class BlockDetectionResponse
---@field type "update:block-detection"
---@field position Vec3
---@field block string

---@class RotationResponse
---@field type "update:rotation"
---@field facing "+x" | "-x" | "-z" | "+z"

---@class PositionResponse
---@field type "update:position"
---@field position Vec3

---@class EquippedResponse
---@field type "update:equipped"
---@field side "right" | "left"
---@field item HeldItem

---@class InventoryResponse
---@field type "update:inventory"
---@field inventory table<number, ItemSlot>

---@class SelectionResponse
---@field type "updated:selection"
---@field slot number

---@class HeartbeatRequest
---@field type "request:heartbeat"

---@class RestartRequest
---@field type "request:restart"

---@class HeartbeatResponse
---@field type "response:heartbeat"
---@field label string | nil
---@field uptime number
---@field position Vec3 | nil
---@field locks LockType[]
---@field tasks RequestBody[]
---@field deviceData HeartbeatDeviceData

---@alias DeviceType "computer" | "pocket" | "turtle"
---@alias HeartbeatDeviceData ComputerHeartbeatData | PocketHeartbeatData | TurtleHeartbeatData

---@class ComputerHeartbeatData
---@field type "computer"

---@class PocketHeartbeatData
---@field type "pocket"

---@class TurtleHeartbeatData
---@field type "turtle"
---@field inventory table<number, ItemSlot>
---@field selectedSlot number
---@field fuel number
---@field leftHand HeldItem|nil
---@field rightHand HeldItem|nil

---@class Vec3
---@field x number
---@field y number
---@field z number

---@class Item
---@field name string
---@field count number

---@alias ItemSlot Item | "empty"

---@class RequestPacket
---@field destination number | "*"
---@field body RequestBody
---@class ResponsePacket
---@field sender number
---@field body ResponseBody

---@alias HeldItem
--- | "empty"
--- | "unknown_item"
--- | "pickaxe"
--- | "axe"
--- | "shovel"
--- | "hoe"
--- | "sword"
--- | "crafting_table"
--- | "speaker"
--- | "ender_modem"
--- | "wireless_modem"
--- | "ap:geoscanner"

---@alias Rotation "+x" | "-x" | "-z" | "+z"
