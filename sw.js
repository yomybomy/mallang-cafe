// 네트워크 우선, 실패하면 캐시. 이미지를 같은 이름으로 바꿔 올리면 다음 접속 때 바로 새 이미지가 보여요.
const VERSION = "mallang-v1";
const CORE = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).catch(() => {})); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(r => { if (r.ok && new URL(e.request.url).origin === location.origin) { const cp = r.clone(); caches.open(VERSION).then(c => c.put(e.request, cp)); } return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});