import { Component, EventEmitter, Input, Output } from '@angular/core'
import { saveAs } from 'file-saver'
import * as JSZip from 'jszip'
import { Observable } from 'rxjs'
import { mergeAll, mergeMap, reduce, take } from 'rxjs/operators'

export const defaultFilename = 'batch-crop-tool'
export const defaultExtension = '.zip'

@Component({
  selector: 'app-image-processor',
  template: `
    <mat-form-field>
      <mat-label>Filename</mat-label>
      <input
        [value]="filename"
        (input)="this.valueChange.emit($event.target.value)"
        matInput
      />
    </mat-form-field>
    <button color="primary" (click)="downloadZippedImages()" mat-flat-button>
      Download images (.zip)
    </button>
  `,
  styles: [
    `
      :host {
        display: grid;
        grid-auto-columns: minmax(max-content, 0.5fr);
        justify-content: center;
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
  @Input()
  filename = defaultFilename
  @Input()
  extension = defaultExtension
  @Output()
  valueChange = new EventEmitter()

  downloadZippedImages() {
    const filename = this.filename === '' ? defaultFilename : this.filename
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
      .subscribe(blob => saveAs(blob, `${filename}${this.extension}`))
  }

  @Input()
  set value(filename: string) {
    this.filename = filename
  }
}
