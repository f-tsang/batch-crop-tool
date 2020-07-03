import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatSelectModule } from '@angular/material/select'
import { MatSliderModule } from '@angular/material/slider'

import {
  ImageSelectorPickerComponent
} from './image-selector-picker/image-selector-picker.component'
import {
  FixDirective,
  ImageSelectorViewerComponent,
  ResizableDirective
} from './image-selector-viewer/image-selector-viewer.component'

@NgModule({
  declarations: [
    ImageSelectorViewerComponent,
    ImageSelectorPickerComponent,
    FixDirective,
    ResizableDirective
  ],
  exports: [ImageSelectorViewerComponent, ImageSelectorPickerComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatSliderModule
  ]
})
export class ImageSelectorModule {}
