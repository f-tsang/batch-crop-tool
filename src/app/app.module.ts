import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppComponent } from './app.component'
import { CropPresetsModule } from './crop-presets/crop-presets.module'
import { ImageProcessorModule } from './image-processor/image-processor.module'
import { ImageSelectorModule } from './image-selector/image-selector.module'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CropPresetsModule,
    ImageSelectorModule,
    ImageProcessorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
