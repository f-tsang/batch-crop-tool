import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  template: `
    <app-crop-presets></app-crop-presets>
    <app-image-selector></app-image-selector>
    <app-image-processor></app-image-processor>
  `,
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
