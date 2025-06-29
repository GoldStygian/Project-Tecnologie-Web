import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withDebugTracing } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './_interceptors/auth-interceptor-interceptor';
import { provideMarkdown }      from 'ngx-markdown';

export const appConfig: ApplicationConfig = {
  providers: [
    provideMarkdown(),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-bottom-right',
      progressBar: true,
      newestOnTop: true,
      preventDuplicates: true,
      countDuplicates: true,
      resetTimeoutOnDuplicate: true,
    }),
    provideRouter(routes, withDebugTracing()),
    provideHttpClient(
      withFetch(), //use the Fetch API instead of XMLHttpRequests
      withInterceptors([authInterceptor])
    ),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true })
  ]
};