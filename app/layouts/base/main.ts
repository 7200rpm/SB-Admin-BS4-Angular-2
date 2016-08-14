import { APP_BASE_HREF } from '@angular/common';
import { enableProdMode, provide } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';

import { APP_ROUTER_PROVIDERS } from './app.routes';
import { AUTH_PROVIDERS } from 'angular2-jwt';

import { Http, HTTP_PROVIDERS } from '@angular/http';
import { AuthConfig, AuthHttp } from 'angular2-jwt';

import { disableDeprecatedForms, provideForms } from '@angular/forms';

import { AppComponent } from './base';

if ('<%= ENV %>' === 'prod') { enableProdMode(); }

/**
 * Bootstraps the application and makes the ROUTER_PROVIDERS and the APP_BASE_HREF available to it.
 * @see https://angular.io/docs/ts/latest/api/platform-browser-dynamic/index/bootstrap-function.html
 */
bootstrap(AppComponent, [
	APP_ROUTER_PROVIDERS,
	AUTH_PROVIDERS,
	HTTP_PROVIDERS,
	disableDeprecatedForms(),
	provideForms(),
	provide(APP_BASE_HREF, { useValue: '<%= APP_BASE %>' }),
	provide(AuthHttp, {
        useFactory: (http: any) => {
            return new AuthHttp(new AuthConfig(), http);
        },
        deps: [Http]
    }),
])
	.catch(err => console.error(err));

// In order to start the Service Worker located at "./worker.js"
// uncomment this line. More about Service Workers here
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
//
// if ('serviceWorker' in navigator) {
//   (<any>navigator).serviceWorker.register('./worker.js').then((registration: any) =>
//       console.log('ServiceWorker registration successful with scope: ', registration.scope))
//     .catch((err: any) =>
//       console.log('ServiceWorker registration failed: ', err));
// }
