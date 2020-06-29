import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppComponent } from './app.component'
import { CropPresetsModule } from './crop-presets/crop-presets.module'
import { ImageProcessorModule } from './image-processor/image-processor.module'
import { ImageSelectorModule } from './image-selector/image-selector.module'
import { OverlayComponent } from './overlay/overlay.component'

@NgModule({
  declarations: [AppComponent, OverlayComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    CropPresetsModule,
    ImageSelectorModule,
    ImageProcessorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
