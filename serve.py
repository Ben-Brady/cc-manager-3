#! /usr/bin/python3
from http.server import BaseHTTPRequestHandler
import socketserver
import json
import os
import atexit
from pathlib import Path

ALLOWED_FOLDERS = ["computer", "proxy-computer"]
PORT = 6543

def all_files_in_folder(folder: str):
    folder_prefix = f"./{folder}/"

    all_files = []
    for path, path_folder, path_files in os.walk(folder):
        path = path.removeprefix(folder_prefix)
        for file in path_files:
            file = Path(path, file)
            all_files.append(file)

    return [Path(file) for file in all_files]


class ProgramServer(BaseHTTPRequestHandler):
    def do_GET(self):
        folder = Path(self.path).name
        if folder not in ALLOWED_FOLDERS:
            self.send_response(404)
            self.end_headers()
            return

        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()

        folder_prefix = f"{Path(folder)}/"

        files = []
        for path, _, path_files in os.walk(folder):
            for file in path_files:
                files.append(Path(path, file))

        file_contents = {
            str(file).removeprefix(folder_prefix): file.read_text()
            for file in files
        }
        self.wfile.write(json.dumps(file_contents).encode())


with socketserver.TCPServer(("127.0.0.1", PORT or 0), ProgramServer, bind_and_activate=False) as socket:
    socket.allow_reuse_address = True
    socket.server_bind()
    socket.server_activate()
    atexit.register(lambda: socket.server_close())

    _, port = socket.socket.getsockname()
    print(f"Serving at http://localhost:{port}")
    try:
        socket.serve_forever()
    except:
        socket.server_close()
