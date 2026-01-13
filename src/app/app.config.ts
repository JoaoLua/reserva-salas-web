import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';

import { routes } from './app.routes';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // 1. Configuração de Rotas (que estava no seu main.ts antigo)
    provideRouter(routes, withComponentInputBinding()),
    
    // 2. Configuração de Animações (necessário para o Angular Material)
    provideAnimations(),
    
    // 3. Configuração do Cliente HTTP com suporte a Interceptores de Classe
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    
    // 4. Registro do seu Interceptor de Autenticação
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
};