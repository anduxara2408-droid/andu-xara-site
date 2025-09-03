#!/usr/bin/env python3
from http.server import HTTPServer, SimpleHTTPRequestHandler
import base64

# Mot de passe personnalisable
USERNAME = "anduxara"
PASSWORD = "client2025"

class AuthHandler(SimpleHTTPRequestHandler):
    def do_HEAD(self):
        self.send_response(401)
        self.send_header('WWW-Authenticate', 'Basic realm=\"Catalogue Andu-xara\"')
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_GET(self):
        auth_header = self.headers.get('Authorization')
        if auth_header is None:
            self.do_HEAD()
            self.wfile.write(b'Authentification requise')
        elif auth_header == 'Basic ' + base64.b64encode(f'{USERNAME}:{PASSWORD}'.encode()).decode():
            SimpleHTTPRequestHandler.do_GET(self)
        else:
            self.do_HEAD()
            self.wfile.write(b'Acces refuse')

# Lance le serveur securise
PORT = 8000
httpd = HTTPServer(('0.0.0.0', PORT), AuthHandler)
print(f"🔒 Serveur securise active sur http://0.0.0.0:{PORT}")
print(f"👤 Utilisateur: {USERNAME}")
print(f"🔑 Mot de passe: {PASSWORD}")
httpd.serve_forever()
