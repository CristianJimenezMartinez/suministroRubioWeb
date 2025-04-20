import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNgxStripe } from 'ngx-stripe';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideHttpClient(),
    provideNgxStripe('clave_privada_stripe')
  ],
};
