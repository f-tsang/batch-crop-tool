import { Component } from '@angular/core'

const appStyles = `
  :host {
    display: grid;
    gap: 1rem;
  }
`

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
  styles: [appStyles]
})
export class ImageSelectorComponent {}
