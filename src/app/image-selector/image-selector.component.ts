import { Component, ViewChild } from '@angular/core'
import { of, zip } from 'rxjs'
import { mergeAll, mergeMap, take, toArray } from 'rxjs/operators'

import {
  ImageSelectorViewerComponent
} from './image-selector-viewer/image-selector-viewer.component'

@Component({
  selector: 'app-image-selector',
  template: `
    <header>2 - Images</header>
    <app-image-selector-picker #picker></app-image-selector-picker>
    <app-image-selector-viewer
      [images]="picker.images"
      (remove)="picker.remove($event)"
    ></app-image-selector-viewer>
  `,
  styles: [
    `
      :host {
        display: grid;
        gap: 1rem;
      }
    `
  ]
})
export class ImageSelectorComponent {
  @ViewChild(ImageSelectorViewerComponent)
  viewer: ImageSelectorViewerComponent

  generateCroppedImages() {
    const images$ = this.viewer.images.pipe(take(1), mergeAll())
    const presetIds$ = of(this.viewer.selectedPresets).pipe(mergeAll())
    return zip(images$, presetIds$).pipe(
      mergeMap(([image, presetId]) =>
        this.viewer
          .findPreset(presetId)
          .pipe(mergeMap(preset => this.viewer.cropImage(image, preset)))
      ),
      toArray()
    )
  }
}
