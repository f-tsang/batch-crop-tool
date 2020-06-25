import {
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core'
import { combineLatest, from, Observable, Subscription } from 'rxjs'
import {
  count,
  distinctUntilChanged,
  filter,
  map,
  mergeAll,
  switchMap
} from 'rxjs/operators'
import { ImagePresetService } from 'src/app/core/image-preset.service'

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

@Component({
  selector: 'app-image-selector-viewer',
  template: `
    <header>3 - Options</header>
    <div class="grid" [style.grid-template-columns]="gridColumnStyle">
      <div
        class="viewer"
        *ngFor="
          let image of images | async;
          let i = index;
          trackBy: trackByItem
        "
      >
        <div class="image-container">
          <!-- Original image display -->
          <img [src]="image" [style.width]="imageWidth" />
          <button class="remove-button" (click)="remove.emit(i)">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        <div class="controls">
          <!-- Preview image button -->
          <button
            (click)="previewImage(image, selectedPresets[i])"
            mat-icon-button
          >
            <mat-icon>image</mat-icon>
          </button>
          <!-- Select crop preset field -->
          <mat-form-field [style.width]="'100%'" appFix>
            <mat-select [(value)]="selectedPresets[i]">
              <mat-option
                *ngFor="let preset of imagePreset.presets$ | async"
                [value]="preset.id"
              >
                {{ preset.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </div>
    </div>
    <p>{{ selectedPresets | json }}</p>
  `,
  styleUrls: ['./image-selector-viewer.component.scss']
})
export class ImageSelectorViewerComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  images: Observable<string[]>
  @Input()
  columns = 3
  @Output()
  remove = new EventEmitter<number>()

  imageWidth: string
  selectedPresets: number[] = []

  private defaultPresetSub: Subscription

  constructor(public imagePreset: ImagePresetService, private el: ElementRef) {}
  ngOnInit() {
    this.initializeSelectedPresets()
  }
  ngAfterViewInit() {
    if (this.el?.nativeElement?.clientWidth) {
      this.imageWidth = `${this.el.nativeElement.clientWidth / this.columns}px`
    }
  }
  ngOnDestroy() {
    this?.defaultPresetSub.unsubscribe()
  }
  trackByItem<T>(_: number, item: T) {
    return item
  }

  previewImage(image: string, cropPresetId: number) {
    // TODO
  }

  get gridColumnStyle() {
    return `repeat(${this.columns}, max-content)`
  }

  private initializeSelectedPresets() {
    const defaultPreset$ = this.imagePreset.presets$.pipe(
      mergeAll(),
      filter(({ default: isDefault }) => isDefault),
      distinctUntilChanged()
    )
    this.defaultPresetSub = combineLatest([this.images, defaultPreset$])
      .pipe(
        switchMap(([images, { id: defaultPresetId }]) =>
          from(images).pipe(
            count(),
            map(length => Array.from({ length }, () => defaultPresetId))
          )
        )
      )
      .subscribe(defaultPresets => (this.selectedPresets = defaultPresets))
  }
}
