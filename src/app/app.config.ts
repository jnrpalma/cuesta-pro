import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PoHttpRequestModule, PoModule, PoLoadingModule, PoFieldModule, PoButtonModule, PoLinkModule, PoDynamicModule, PoNotificationModule } from '@po-ui/ng-components';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { environment } from '../environments/environments';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom([
      BrowserAnimationsModule,
      HttpClientModule,
      PoHttpRequestModule,
      PoModule,
      PoLoadingModule,
      PoFieldModule,
      PoButtonModule,
      PoLinkModule,
      PoDynamicModule,
      PoNotificationModule,
      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFireAuthModule
    ]),
  ],
};
