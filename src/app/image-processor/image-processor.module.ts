import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

import { ImageProcessorComponent } from './image-processor.component'

@NgModule({
  declarations: [ImageProcessorComponent],
  exports: [ImageProcessorComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule]
})
export class ImageProcessorModule {}
