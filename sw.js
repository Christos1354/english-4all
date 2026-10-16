// Αγγλικά 5' – service worker · 16-10-2026 09:57
// Πρώτα δοκιμάζει το ίντερνετ (για να βλέπετε πάντα τη νέα έκδοση).
// Αν δεν υπάρχει σύνδεση, ανοίγει την τελευταία αποθηκευμένη.
const CACHE = 'agglika5-2026-10-16-0957';
const CORE = ['./', 'index.html', 'lexilogio.html', 'anomala.html', 'manifest.json', 'favicon.png', 'icon-180.png', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {})))));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return r;
    }).catch(() => caches.match(e.request, {ignoreSearch: true}).then(r => r || caches.match('./')))
  );
});
