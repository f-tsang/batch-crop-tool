import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatSelectModule } from '@angular/material/select'

import {
  ImageSelectorPickerComponent
} from './image-selector-picker/image-selector-picker.component'
import {
  FixDirective,
  ImageSelectorViewerComponent
} from './image-selector-viewer/image-selector-viewer.component'
import { ImageSelectorComponent } from './image-selector.component'

@NgModule({
  declarations: [
    ImageSelectorComponent,
    ImageSelectorViewerComponent,
    ImageSelectorPickerComponent,
    FixDirective
  ],
  exports: [
    ImageSelectorComponent,
    ImageSelectorViewerComponent,
    ImageSelectorPickerComponent
  ],
  imports: [CommonModule, MatIconModule, MatButtonModule, MatSelectModule]
})
export class ImageSelectorModule {}
