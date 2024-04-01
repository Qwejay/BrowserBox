import {DEBUG, CONFIG, VERSION} from './voodoo/src/common.js';

navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => {
    // Extract the version from the scriptURL
    if ( registrations?.active?.scriptURL ) {
      let url = new URL(registration?.active?.scriptURL);
      let version = url.searchParams.get('ver');

      // Unregister if the version does not match
      if (version !== VERSION) {
        registration.unregister().then(bool => {
          if (bool) console.log('Unregistered an old service worker.');
        });
      }
    }
  });
});

if (DEBUG.mode == 'prod' && CONFIG.useServiceWorkerToCache && 'serviceWorker' in navigator) {
  const S = navigator.serviceWorker;

  // allow SW to reload the pages if they need to update to fresh content
  S.addEventListener('message', event => {
    if ( event.data = 'cache-out-of-sync' ) {
      console.log('Cache out of sync, reloading page.');
      globalThis.window.location.reload();
    }
  });

  S.register(`/sw.js?ver=${VERSION}`).then(registration => {
    console.log('Service Worker registered with scope:', registration.scope);
  })
  .catch(error => {
    console.error('Service Worker registration failed:', error);
  });
}

