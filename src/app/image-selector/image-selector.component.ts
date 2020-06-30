import { Component, ViewChild } from '@angular/core'

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
  @ViewChild(ImageSelectorViewerComponent, { static: true })
  private viewer: ImageSelectorViewerComponent

  get croppedImages() {
    return this.viewer.croppedImages
  }
}
