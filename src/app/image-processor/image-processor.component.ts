import { Component, OnInit } from '@angular/core'

/**
 * TODO - ...
 */
@Component({
  selector: 'app-image-processor',
  template: `
    <header>4 - Finish</header>
    <a download="batch-crop-tool" color="primary" mat-flat-button
      >Download images (.zip)</a
    >
  `,
  styles: []
})
export class ImageProcessorComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
