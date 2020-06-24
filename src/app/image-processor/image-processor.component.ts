import { Component, OnInit } from '@angular/core'

/**
 * TODO - ...
 */
@Component({
  selector: 'app-image-processor',
  template: `
    <header>4 - Download</header>
    <button color="primary" mat-flat-button>Download images (.zip)</button>
  `,
  styles: []
})
export class ImageProcessorComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
