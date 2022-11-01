/*self.addEventListener("activate",  function(event) {

    event.waitUntil(self.clients.claim().then(function() {
  
        self.skipWaiting();
  
    }));
  
});
  


self.addEventListener("fetch", event => {
    if (event.request.url === "https://www.yann.wysigot.com/undernou") {
        event.respondWith(
            fetch(event.request).catch(err =>
                self.cache.open("undernou").then(cache =>
                    cache.mach("/index.html")
                )
            )
        );
    } else {
        event.respondWith(
            fetch(event.request).catch(err =>
                caches.match(event.request).then(response => response)
            )
        );
    }
});



self.addEventListener("fetch", function(event) {
  
    event.respondWith(caches.match(event.request).then(function(response) {
  
        if (response && response.ok) {
  
            return response;
  
        }
  
    }));
  
});


/*
self.addEventListener("install", function(event) {
  
    event.waitUntil(caches.open("undernou").then(function(cache) {
  
        return cache.addAll(["/", 
            "app.webmanifest", 
            "index.html", 
            "script.js", 
            "styles.css",
            "img/icon-192x192.png",
            "img/icon-256x256.png",
            "img/icon-384x384.png",
            "img/icon-512x512.png", 
            "img/logo.png"
        ]).then(function() {
  
            self.skipWaiting();
  
        });
  
    }));
  
});*/



self.addEventListener("fetch", event => {
    if (event.request.url === "https://www.yann.wysigot.com/insider") {
        event.respondWith(
            fetch(event.request).catch(err =>
                self.cache.open("insider_cache").then(cache => cache.match("/index.html"))
            )
        );
    } else {
        event.respondWith(
            fetch(event.request).catch(err =>
                caches.match(event.request).then(response => response)
            )
        );
    }
});



self.addEventListener("install", function(event) {
  
    event.waitUntil(caches.open("insider_cache").then(function(cache) {
  
        return cache.addAll(["/", 
            "app.webmanifest", 
            "index.html", 
            "js/index.js", 
            "css/styles.css"/*,
            "img/icon-192x192.png",
            "img/icon-256x256.png",
            "img/icon-384x384.png",
            "img/icon-512x512.png", 
            "img/logo.png"*/
        ]).then(function() {
  
            self.skipWaiting();
  
        });
  
    }));
  
});