import { Component, Input } from '@angular/core'
import { saveAs } from 'file-saver'
import * as JSZip from 'jszip'
import { Observable } from 'rxjs'
import { mergeAll, mergeMap, reduce, take } from 'rxjs/operators'

/**
 * TODO - ...
 */
@Component({
  selector: 'app-image-processor',
  template: `
    <mat-form-field>
      <mat-label>Filename</mat-label>
      <input [(value)]="filename" matInput />
    </mat-form-field>
    <button color="primary" (click)="downloadZippedImages()" mat-flat-button>
      Download images (.zip)
    </button>
  `,
  styles: [
    `
      :host {
        display: grid;
        grid-auto-flow: row;
        justify-content: left;
      }
      header {
        margin-bottom: 1rem;
      }
    `
  ]
})
export class ImageProcessorComponent {
  @Input()
  images: Observable<string[]>
  filename = this.defaultFilename
  extension = '.zip'

  downloadZippedImages() {
    const filename = this.filename === '' ? this.defaultFilename : this.filename
    const addImageToZip = (zipFile: JSZip, image: string, index: number) => {
      const base64Image = image.split(',')[1]
      zipFile.file(`${index}.png`, base64Image, { base64: true })
      return zipFile
    }
    this.images
      .pipe(
        take(1),
        mergeAll(),
        reduce(addImageToZip, new JSZip()),
        mergeMap(zipFile => zipFile.generateAsync({ type: 'blob' }))
      )
      .subscribe(zipFile => saveAs(zipFile, `${filename}${this.extension}`))
  }

  get defaultFilename() {
    return 'batch-crop-tool'
  }
}
