'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "icons/ms-icon-310x310.png": "423cc88d87b647c9bc2f2195c601bfb7",
"icons/ms-icon-144x144.png": "1ee627d4486c53791d36396480b3ff78",
"icons/apple-icon-57x57.png": "f5ceaf0c8e351dd14ae890fab2a4b1c1",
"icons/ms-icon-70x70.png": "134a3069ba0c044e5409b53978d69a51",
"icons/apple-icon-60x60.png": "10572972a1b1a028b551df7b5767e572",
"icons/ms-icon-150x150.png": "c9fe78d34502877f5024af6de88e7cb9",
"icons/logo.png": "9e28d44aef11a66861cc524340759665",
"icons/favicon.ico": "a9e6929c988d9d0617dcfa3563dd588a",
"icons/favicon-32x32.png": "7a26ab096d9f6270ed49301989b7d919",
"icons/android-icon-36x36.png": "dcebd64a5b69c8ac5edc49308e49c719",
"icons/manifest.json": "b58fcfa7628c9205cb11a1b2c3e8f99a",
"icons/apple-icon-76x76.png": "fa8a62d6fdea57eab924ae74a11fbdd9",
"icons/apple-icon-114x114.png": "7365839fd0cce2eed56f49fab4b22f37",
"icons/favicon-16x16.png": "05435c9036c44183f648ea5077afd5d4",
"icons/apple-icon-152x152.png": "41ad95efd8d0bb0249b4fb98518c9ea3",
"icons/android-icon-72x72.png": "92b884cb1b975f41d94b72a6e2b6179c",
"icons/favicon-96x96.png": "44aa3ae2b2db1d471639983b2214af06",
"icons/android-icon-96x96.png": "44aa3ae2b2db1d471639983b2214af06",
"icons/apple-icon-120x120.png": "54ea1a204bc0b1c72a442a01fd9f9d28",
"icons/apple-icon.png": "b3299495afd02a3dddcef490363e95e9",
"icons/apple-icon-72x72.png": "92b884cb1b975f41d94b72a6e2b6179c",
"icons/apple-icon-precomposed.png": "b3299495afd02a3dddcef490363e95e9",
"icons/maskable_icon.png": "e2991b3a5e0c408b3c9c84e05f831ab8",
"icons/apple-icon-180x180.png": "666ad2681844ac1f2a8a574b413d9ad6",
"icons/android-icon-48x48.png": "de9172da50cd6c0fd085d16f37b600ef",
"icons/android-icon-144x144.png": "1ee627d4486c53791d36396480b3ff78",
"icons/apple-icon-144x144.png": "1ee627d4486c53791d36396480b3ff78",
"icons/android-icon-192x192.png": "802cce5e8b2763d301b895060dffe18a",
"icons/browserconfig.xml": "653d077300a12f09a69caeea7a8947f8",
"manifest.json": "bc4f2ea0eab7eaa2a60f5a51ed56dd19",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/NOTICES": "95379c411d4f6ee261b9678507a59647",
"assets/assets/fonts/Montserrat-Italic.ttf": "a7063e0c0f0cb546ad45e9e24b27bd3b",
"assets/assets/fonts/Montserrat-Bold.ttf": "ade91f473255991f410f61857696434b",
"assets/assets/fonts/Montserrat-Regular.ttf": "ee6539921d713482b8ccd4d0d23961bb",
"assets/assets/images/logo.png": "9e28d44aef11a66861cc524340759665",
"assets/assets/images/bg.jpg": "0cf150725ee3400c9e94ca935601399a",
"assets/assets/sounds/timeUp.wav": "aaa3a5b4bff2f29b10d1b3507a90cd8f",
"assets/AssetManifest.json": "055b7eea8359df1016210a758423d359",
"assets/FontManifest.json": "0f7f78d16f3d8f0084a68ca1bdc003c9",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"index.html": "db48cdf211474a2480169cfd93713742",
"/": "db48cdf211474a2480169cfd93713742",
"version.json": "934235b1265b0059029a6d0311c72681",
"main.dart.js": "38c9431d91e7b11a12ef933990eee1cf",
"favicon.png": "5dcef449791fa27946b3d35ad8803796"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
