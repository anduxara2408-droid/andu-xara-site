/* Bouton flottant XA IA : ouvre la nouvelle page de discussion. */
(function () {
  if (document.getElementById('xa-launch') || /xa-ia-/.test(location.pathname)) return;
  var st = document.createElement('style');
  st.textContent = '#xa-launch{position:fixed;right:16px;bottom:16px;z-index:9999;display:flex;align-items:center;gap:8px;background:#142a4f;color:#F0D080;border:1.5px solid #C9A84C;border-radius:999px;padding:12px 18px;font:600 14px Montserrat,system-ui,sans-serif;text-decoration:none;box-shadow:0 10px 30px -10px rgba(0,0,0,.6)}#xa-launch b{font-family:"Cormorant Garamond",Georgia,serif;font-size:20px;color:#fff}#xa-launch:hover{background:#1c3a6b}#xa-launch img{width:30px;height:30px;border-radius:50%;object-fit:cover;border:1.5px solid #C9A84C}';
  document.head.appendChild(st);
  var a = document.createElement('a');
  a.id = 'xa-launch'; a.href = '/xa-ia-hub.html';
  a.setAttribute('aria-label', 'Parler soninké avec XA IA');
  a.innerHTML = '<img src="/xa-ia/img/xa-ia-visage.jpg" alt="" width="30" height="30"><b>XA·IA</b><span>Parler soninké</span>';
  document.body.appendChild(a);
})();
