import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  template: `
    <header class="title">Batch Crop Tool</header>
    <app-crop-tool-stepper></app-crop-tool-stepper>
    <!-- Overlay -->
    <app-overlay></app-overlay>
  `,
  styles: [
    `
      :host {
        display: grid;
        /* TBD: Allow this to be edited in-app */
        grid-auto-columns: minmax(40rem, 50rem);
        grid-auto-rows: max-content;
        justify-content: center;
        height: 100%;
        background: gainsboro;
        overflow: auto;
      }
      .title {
        margin-top: 1rem;
        text-align: center;
        font-size: 2.25rem;
        font-family: 'Lucida Sans Unicode', 'Lucida Grande', sans-serif;
      }
    `
  ]
})
export class AppComponent {}
