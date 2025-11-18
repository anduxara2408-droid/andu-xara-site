const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const http = require('http');

let previewPanel = null;
let server = null;

function activate(context) {
    console.log('🚀 Extension Mobile Preview activée!');

    // Commande pour ouvrir l'aperçu mobile
    const openPanelCommand = vscode.commands.registerCommand('mobile-preview.openPanel', openMobilePreview);
    
    // Commande pour recharger
    const refreshCommand = vscode.commands.registerCommand('mobile-preview.refresh', () => {
        if (previewPanel) {
            previewPanel.webview.postMessage({ command: 'refresh' });
        }
    });

    // Démarrer le serveur local au démarrage
    startLocalServer();

    // Watch les fichiers pour auto-reload
    const watcher = vscode.workspace.createFileSystemWatcher('**/*.{html,css,js}');
    watcher.onDidChange(() => {
        if (previewPanel) {
            previewPanel.webview.postMessage({ command: 'refresh' });
        }
    });

    context.subscriptions.push(openPanelCommand, refreshCommand, watcher);
}

function openMobilePreview() {
    if (previewPanel) {
        previewPanel.reveal(vscode.ViewColumn.Beside);
        return;
    }

    // Créer le panneau webview
    previewPanel = vscode.window.createWebviewPanel(
        'mobilePreview',
        '📱 Aperçu Mobile',
        vscode.ViewColumn.Beside,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
            portMapping: [
                {
                    webviewPort: 5500,
                    extensionHostPort: 5500
                }
            ]
    });

    // Charger le contenu HTML du téléphone
    const htmlContent = getWebviewContent();
    previewPanel.webview.html = htmlContent;

    // Nettoyer quand on ferme
    previewPanel.onDidDispose(
        () => { previewPanel = null; },
        null
    );

    // Recevoir les messages du webview
    previewPanel.webview.onDidReceiveMessage(
        message => {
            switch (message.command) {
                case 'alert':
                    vscode.window.showInformationMessage(message.text);
                    break;
            }
        }
    );
}

function getWebviewContent() {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📱 Mobile Preview</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .controls {
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .controls input {
            padding: 10px;
            border: none;
            border-radius: 4px;
            width: 250px;
            font-size: 14px;
        }

        .controls button {
            padding: 10px 20px;
            background: #00d4ff;
            color: #000;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.2s;
        }

        .controls button:hover {
            background: #00b8d4;
            transform: scale(1.05);
        }

        .phone-wrapper {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .phone {
            width: 100%;
            max-width: 390px;
            aspect-ratio: 9/16;
            background: #000;
            border-radius: 40px;
            border: 12px solid #1a1a1a;
            box-shadow: 
                0 0 0 1px #444,
                0 20px 60px rgba(0,0,0,0.8),
                inset 0 0 0 1px #333;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            position: relative;
        }

        .phone::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 150px;
            height: 25px;
            background: #000;
            border-radius: 0 0 25px 25px;
            z-index: 10;
            box-shadow: inset 0 -5px 10px rgba(0,0,0,0.5);
        }

        .status-bar {
            height: 25px;
            background: #000;
            color: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 12px;
            font-size: 12px;
            font-weight: 600;
            z-index: 5;
        }

        .status-time {
            letter-spacing: 0.5px;
        }

        .status-icons {
            display: flex;
            gap: 4px;
            font-size: 10px;
        }

        .phone-screen {
            flex: 1;
            overflow: hidden;
            background: #fff;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .phone-screen iframe {
            width: 100%;
            height: 100%;
            border: none;
            background: #fff;
        }

        .loading {
            color: #999;
            font-size: 14px;
            text-align: center;
        }

        .phone-button {
            position: absolute;
            right: -8px;
            top: 100px;
            width: 4px;
            height: 40px;
            background: #555;
            border-radius: 0 4px 4px 0;
            box-shadow: -2px 2px 5px rgba(0,0,0,0.3);
        }

        .device-selector {
            display: flex;
            gap: 8px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .device-btn {
            padding: 6px 12px;
            background: #333;
            color: #fff;
            border: 2px solid transparent;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
        }

        .device-btn.active {
            background: #00d4ff;
            color: #000;
            border-color: #00a8b8;
            font-weight: bold;
        }

        .device-btn:hover:not(.active) {
            background: #444;
            border-color: #00d4ff;
        }

        .info {
            color: #aaa;
            font-size: 12px;
            text-align: center;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="controls">
            <input type="text" id="urlInput" placeholder="http://localhost:5500" value="http://localhost:5500">
            <button onclick="reloadFrame()">🔄 Recharger</button>
        </div>

        <div style="text-align: center;">
            <div class="device-selector">
                <button class="device-btn active" onclick="selectDevice('iphone', this)">iPhone 14</button>
                <button class="device-btn" onclick="selectDevice('pixel', this)">Pixel 7</button>
                <button class="device-btn" onclick="selectDevice('ipad', this)">iPad</button>
            </div>
        </div>

        <div class="phone-wrapper">
            <div class="phone" id="phone">
                <div class="status-bar">
                    <span class="status-time" id="time">9:41</span>
                    <span class="status-icons">📶 🔋</span>
                </div>
                <div class="phone-screen">
                    <iframe id="preview" src="http://localhost:5500"></iframe>
                </div>
                <div class="phone-button"></div>
            </div>
        </div>

        <div class="info">
            💡 Modifiez votre code → Ctrl+S → La page se met à jour automatiquement
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();

        // Mettre à jour l'heure
        setInterval(() => {
            const now = new Date();
            document.getElementById('time').textContent = 
                String(now.getHours()).padStart(2, '0') + ':' + 
                String(now.getMinutes()).padStart(2, '0');
        }, 1000);

        // Changer l'URL
        document.getElementById('urlInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                loadURL(document.getElementById('urlInput').value);
            }
        });

        function loadURL(url) {
            document.getElementById('preview').src = url;
        }

        function reloadFrame() {
            document.getElementById('preview').contentWindow.location.reload();
        }

        function selectDevice(device, button) {
            const phone = document.getElementById('phone');
            document.querySelectorAll('.device-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            switch(device) {
                case 'iphone':
                    phone.style.maxWidth = '390px';
                    phone.style.aspectRatio = '9/16';
                    break;
                case 'pixel':
                    phone.style.maxWidth = '412px';
                    phone.style.aspectRatio = '20.5/9';
                    break;
                case 'ipad':
                    phone.style.maxWidth = '600px';
                    phone.style.aspectRatio = '4/3';
                    break;
            }
        }

        // Auto-reload quand VS Code envoie un message
        window.addEventListener('message', event => {
            const message = event.data;
            if (message.command === 'refresh') {
                reloadFrame();
            }
        });
    </script>
</body>
</html>`;
}

function startLocalServer() {
    if (server) return;

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) return;

    const ROOT_DIR = workspaceFolder.uri.fsPath;
    const PORT = 5500;

    const MIME_TYPES = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.mp4': 'video/mp4',
        '.mp3': 'audio/mpeg'
    };

    server = http.createServer((req, res) => {
        let filePath = path.join(ROOT_DIR, req.url === '/' ? 'index.html' : req.url);

        const normalizedPath = path.normalize(filePath);
        if (!normalizedPath.startsWith(ROOT_DIR)) {
            res.writeHead(403);
            res.end('Accès refusé');
            return;
        }

        fs.stat(filePath, (err, stats) => {
            if (!err && stats.isDirectory()) {
                filePath = path.join(filePath, 'index.html');
            }

            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(`<h1>404 - Non trouvé: ${req.url}</h1>`);
                } else {
                    const ext = path.extname(filePath).toLowerCase();
                    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(data);
                }
            });
        });
    });

    server.listen(PORT, '0.0.0.0');
    console.log(`✅ Serveur local lancé sur http://localhost:${PORT}`);
}

function deactivate() {
    if (server) {
        server.close();
    }
}

module.exports = {
    activate,
    deactivate
};
