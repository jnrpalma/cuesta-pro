import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideHttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PoHttpRequestModule, PoModule, PoLoadingModule, PoFieldModule, PoButtonModule, PoLinkModule, PoDynamicModule, PoNotificationModule } from '@po-ui/ng-components';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { environment } from '../environments/environments';


import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { PoHttpRequestModule } from '@po-ui/ng-components';


import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { PoHttpRequestModule } from '@po-ui/ng-components';


import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { PoHttpRequestModule } from '@po-ui/ng-components';


import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { PoHttpRequestModule } from '@po-ui/ng-components';

import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { PoHttpRequestModule } from '@po-ui/ng-components';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom([PoHttpRequestModule]),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi())
  ],
  ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi())
  ],
  ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi())
  ],
  ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi())
  ],
  ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi())
  ],
  ),
  ],
};