import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  template: `
    <header>Batch Crop Tool</header>
    <app-crop-presets></app-crop-presets>
    <app-image-selector></app-image-selector>
    <app-image-processor></app-image-processor>
    <app-overlay></app-overlay>
  `,
  // TODO - Section colours: blue, pink, light gray, dark gray
  styles: [
    `
      :host {
        display: grid;
        grid-auto-columns: 40rem;
        justify-content: center;
      }
    `
  ]
})
export class AppComponent {}
