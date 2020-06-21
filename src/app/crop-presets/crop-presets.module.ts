import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'

import { CropPresetsComponent } from './crop-presets.component'

@NgModule({
  declarations: [CropPresetsComponent],
  imports: [CommonModule, MatInputModule, MatButtonModule, MatIconModule],
  exports: [CropPresetsComponent]
})
export class CropPresetsModule {}
