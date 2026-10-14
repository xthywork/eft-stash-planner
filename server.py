"""Serve the planner and a local, bounded CP-SAT optimization endpoint."""
import json
import threading
import select
import socket
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from packing_solver import solve_packing

ROOT = Path(__file__).resolve().parent
SOLVING = threading.Semaphore(1)

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        if any(part.startswith('.') for part in self.path.split('/')):
            self.send_error(404)
            return
        super().do_GET()

    def do_POST(self):
        if self.path != '/api/solve':
            self.send_error(404)
            return
        length = int(self.headers.get('Content-Length', '0'))
        if not 0 < length <= 5_000_000:
            self.send_error(413)
            return
        data = json.loads(self.rfile.read(length))
        self.send_response(200)
        self.send_header('Content-Type', 'application/x-ndjson; charset=utf-8')
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        def send(message):
            self.wfile.write((json.dumps(message, ensure_ascii=False) + '\n').encode())
            self.wfile.flush()
        cancelled, finished = threading.Event(), threading.Event()
        def watch_connection():
            while not finished.wait(.1):
                try:
                    ready, _, _ = select.select([self.connection], [], [], 0)
                    if ready and not self.connection.recv(1, socket.MSG_PEEK):
                        cancelled.set()
                        return
                except OSError:
                    cancelled.set()
                    return
        threading.Thread(target=watch_connection, daemon=True).start()
        try:
            with SOLVING:
                if cancelled.is_set():
                    return
                send({'type': 'progress', 'visited': 0})
                solve_packing(data, send, cancelled)
        except (BrokenPipeError, ConnectionResetError):
            pass
        except Exception as error:
            try:
                send({'type': 'error', 'message': str(error)})
            except (BrokenPipeError, ConnectionResetError):
                pass

        finally:
            finished.set()

if __name__ == '__main__':
    server = ThreadingHTTPServer(('0.0.0.0', 49237), Handler)
    server.daemon_threads = True
    server.serve_forever()
