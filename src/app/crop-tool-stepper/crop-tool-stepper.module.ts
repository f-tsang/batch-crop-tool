import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatStepperModule } from '@angular/material/stepper'

import { CropPresetsModule } from '../crop-presets/crop-presets.module'
import { ImageProcessorModule } from '../image-processor/image-processor.module'
import { ImageSelectorModule } from '../image-selector/image-selector.module'
import { CropToolStepperComponent } from './crop-tool-stepper.component'

@NgModule({
  declarations: [CropToolStepperComponent],
  exports: [CropToolStepperComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatStepperModule,
    MatFormFieldModule,
    CropPresetsModule,
    ImageSelectorModule,
    ImageProcessorModule
  ]
})
export class CropToolStepperModule {}
