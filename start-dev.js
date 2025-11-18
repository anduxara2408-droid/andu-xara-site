const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const ROOT_DIR = __dirname;

// Types MIME courants
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.mp3': 'audio/mpeg',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
    // Récupère le chemin du fichier demandé
    let filePath = path.join(ROOT_DIR, req.url === '/' ? 'index.html' : req.url);

    // Évite les traversées de répertoires
    const normalizedPath = path.normalize(filePath);
    if (!normalizedPath.startsWith(ROOT_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Accès refusé');
        return;
    }

    // Vérifie si le fichier est un répertoire
    fs.stat(filePath, (err, stats) => {
        if (!err && stats.isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }

        // Lit le fichier
        fs.readFile(filePath, (err, data) => {
            if (err) {
                // Fichier non trouvé
                if (err.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8">
                            <title>404 - Non trouvé</title>
                            <style>
                                body { font-family: Arial; text-align: center; padding: 50px; background: #f5f5f5; }
                                h1 { color: #e74c3c; }
                                p { color: #666; }
                            </style>
                        </head>
                        <body>
                            <h1>404 - Page non trouvée</h1>
                            <p>Le fichier demandé n'existe pas: ${req.url}</p>
                        </body>
                        </html>
                    `);
                } else {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Erreur serveur: ' + err.message);
                }
            } else {
                // Fichier trouvé, envoie le contenu
                const ext = path.extname(filePath).toLowerCase();
                const contentType = MIME_TYPES[ext] || 'application/octet-stream';

                res.writeHead(200, {
                    'Content-Type': contentType,
                    'Cache-Control': 'no-cache'
                });
                res.end(data);
            }
        });
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🌐 Serveur HTTP lancé !`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`📁 Répertoire : ${ROOT_DIR}`);
    console.log(`\n✅ Appuyez sur Ctrl+C pour arrêter\n`);
});

// Gestion de l'arrêt gracieux
process.on('SIGINT', () => {
    console.log('\n\n🛑 Arrêt du serveur...');
    server.close(() => {
        console.log('✅ Serveur arrêté.');
        process.exit(0);
    });
});
