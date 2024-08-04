import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { defineCustomElements } from '@ionic/pwa-elements/loader';


//For camere run web based projects
defineCustomElements(window);
if (environment.production) {
  enableProdMode();
}
 

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));