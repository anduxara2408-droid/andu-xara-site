const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

let phonePreviewPanel;

function activate(context) {
    console.log('Extension Mobile Preview activée!');

    // Commande pour ouvrir l'aperçu mobile
    let disposable = vscode.commands.registerCommand('mobile-preview.openPreview', () => {
        if (phonePreviewPanel) {
            phonePreviewPanel.reveal(vscode.ViewColumn.Two);
            return;
        }

        // Créer le panneau webview
        phonePreviewPanel = vscode.window.createWebviewPanel(
            'mobilePreview',
            '📱 Aperçu Mobile',
            vscode.ViewColumn.Two,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [
                    vscode.Uri.file(path.join(context.extensionPath))
                ]
            }
        );

        // Charger le HTML du téléphone
        const htmlPath = path.join(context.extensionPath, '..', 'webview-preview.html');
        let html = fs.readFileSync(htmlPath, 'utf8');

        phonePreviewPanel.webview.html = html;

        // Nettoyer quand on ferme le panneau
        phonePreviewPanel.onDidDispose(
            () => { phonePreviewPanel = null; },
            null,
            context.subscriptions
        );

        // Reload automatique sur sauvegarde
        vscode.workspace.onDidSaveTextDocument((document) => {
            if (phonePreviewPanel) {
                phonePreviewPanel.webview.postMessage({
                    command: 'reload'
                });
            }
        });
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
