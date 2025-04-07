# Computer Craft Manager

A framework for managing Turtles in Computer Craft, supporting a frontend and standalone scripts.

https://github.com/user-attachments/assets/7dec592c-49a6-4e62-9550-cd97e3616525

## Folders

-   computer
    -   The Computer Craft Computer code
-   computer-serve
    -   A server and startscript pair that sends
-   server
    -   A Websocket proxy in charge of proxying packets between computer craft and clients
    -   Additionally contains a HTTP api for getting saved information so the client can get presistance
-   frontend
    -   A react frontend for the viewing and control devices from the browser
-   scripts
    -   Standalone scripts for controlling turtles
-   packages/ccm-packet
    -   The packet format used to send messages to and from devices
-   packages/ccm-memory
    -   A san-io manager for persisting data and mutating the state from packet information
    -   Feed it packets, block or device data and it'll update the known state.
-   packages/ccm-connection
    -   A WebSocket manager controlling reconnecting and packet decoding
    -   Also contains the HTTP and standard requests pairs for request and response packets
    -   Used in website and scripts
