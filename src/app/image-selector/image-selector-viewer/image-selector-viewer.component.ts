import {
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output
} from '@angular/core'
import { Observable } from 'rxjs'

/**
 * TODO
 *  - Rename as FixFormFieldDirective [fixFormField]
 *  - Move to a shared folder.
 */
@Directive({
  selector: '[appFix]'
})
export class FixDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}
  ngAfterViewInit() {
    const infix = this.el?.nativeElement?.querySelector('.mat-form-field-infix')
    if (infix) {
      infix.style.width = 'auto'
    }
  }
}

/**
 * TODO
 *  - Select preset to use for cropping ----------------------------------------
 */
@Component({
  selector: 'app-image-selector-viewer',
  template: `
    <header>3 - Options</header>
    <div class="grid" [style.grid-template-columns]="columnCount">
      <div
        class="viewer"
        *ngFor="
          let image of images | async;
          let i = index;
          trackBy: trackByItem
        "
      >
        <div class="image-container">
          <img [src]="image" [style.width]="imageWidth" />
          <button class="remove-button" (click)="remove.emit(i)">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        <div class="controls">
          <button mat-icon-button>
            <mat-icon>image</mat-icon>
          </button>
          <mat-form-field [style.width]="'100%'" appFix>
            <mat-select [value]="1">
              <mat-option *ngFor="let v of [1, 2, 3]" [value]="v">
                {{ v }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./image-selector-viewer.component.scss']
})
export class ImageSelectorViewerComponent implements AfterViewInit {
  @Input()
  images: Observable<string[]>
  @Input()
  columns = 3
  @Output()
  remove = new EventEmitter<number>()
  imageWidth: string

  constructor(private el: ElementRef) {}
  ngAfterViewInit() {
    if (this.el?.nativeElement?.clientWidth) {
      this.imageWidth = `${this.el.nativeElement.clientWidth / this.columns}px`
    }
  }
  trackByItem<T>(_: number, item: T) {
    return item
  }

  get columnCount() {
    return `repeat(${this.columns}, max-content)`
  }
}
