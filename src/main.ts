import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { authInterceptor } from './app/core/auth-interceptor';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(FormsModule), // ✅ CORRECT
    provideRouter (routes)
  ]
});



// amanullah435islam@gmail.com
// AmAnUllAh2024