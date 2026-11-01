/* Mi SABES: primero la red, y si no hay señal, la última versión vista. */
const CACHE = "mi-sabes-v1";
self.addEventListener("install", function(e){ self.skipWaiting(); });
self.addEventListener("activate", function(e){ e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", function(e){
  const req = e.request;
  if (req.method !== "GET" || req.mode !== "navigate") return;
  e.respondWith(
    fetch(req).then(function(res){
      const copia = res.clone();
      caches.open(CACHE).then(function(c){ c.put("./", copia); }).catch(function(){});
      return res;
    }).catch(function(){
      return caches.match("./").then(function(r){ return r || new Response("Sin conexión. Abre la página cuando tengas internet.", {status: 503, headers: {"Content-Type": "text/plain; charset=utf-8"}}); });
    })
  );
});
