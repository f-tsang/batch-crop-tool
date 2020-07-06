import { NgModule } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ServiceWorkerModule } from '@angular/service-worker'

import { environment } from '../environments/environment'
import { AppComponent } from './app.component'
import {
  CropToolStepperModule
} from './crop-tool-stepper/crop-tool-stepper.module'
import { OverlayComponent } from './overlay/overlay.component'

@NgModule({
  declarations: [AppComponent, OverlayComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    }),
    MatIconModule,
    CropToolStepperModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
