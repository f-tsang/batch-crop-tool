import {
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core'
import { combineLatest, from, Observable, Subscription } from 'rxjs'
import {
  count,
  distinctUntilChanged,
  filter,
  map,
  mergeAll,
  mergeMap,
  switchMap,
  take
} from 'rxjs/operators'
import {
  CropPreset,
  ImagePresetService
} from 'src/app/core/image-preset.service'
import { ImageService } from 'src/app/core/image.service'
import { OverlayService } from 'src/app/core/overlay.service'

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

/** TBD */
@Directive({
  selector: '[appResizable]'
})
export class ResizableDirective {
  resize = false

  @HostListener('click') clickToResize() {
    this.resize = !this.resize
  }
  @HostBinding('style.max-width')
  get maxWidth() {
    return this.resize ? 'calc(100vw - (100vw - 100%))' : 'none'
  }
  @HostBinding('style.max-height')
  get maxHeight() {
    return this.resize ? 'calc(100vh - (100vh - 100%))' : 'none'
  }
  @Input()
  set appResizable(resize: boolean) {
    this.resize = resize
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
            (click)="showPreviewImage(image, selectedPresets[i])"
            mat-icon-button
          >
            <mat-icon>image</mat-icon>
          </button>
          <!-- Select crop preset field -->
          <mat-form-field [style.width]="'100%'" appFix>
            <mat-select [(value)]="selectedPresets[i]">
              <mat-option
                *ngFor="let preset of imagePreset.presets | async"
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

    <ng-template #preview let-imageSource="image" let-resizeImage="resize">
      <img [src]="imageSource" [appResizable]="resizeImage" />
      <p [style.text-align]="'center'">
        <i>Click to enable/disable scrollbars</i>
      </p>
    </ng-template>
    <ng-template #previewError let-message>
      <article class="preview-error">
        <h3>Error</h3>
        <p>{{ message }}</p>
      </article>
    </ng-template>
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
  @ViewChild('preview')
  preview: TemplateRef<ElementRef>
  @ViewChild('previewError')
  previewError: TemplateRef<ElementRef>

  imageWidth: string
  selectedPresets: number[] = []

  private defaultPresetSub: Subscription

  constructor(
    public imagePreset: ImagePresetService,
    private imageSvc: ImageService,
    private overlay: OverlayService,
    private el: ElementRef
  ) {}
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

  showPreviewImage(imageSource: string, cropPresetId: number) {
    const generatePreview = mergeMap((presets: CropPreset[]) => {
      const preset = presets.find(({ id }) => id === cropPresetId)
      if (preset) {
        const { width: w, height: h, 'x-offset': x, 'y-offset': y } = preset
        if (w < 1 || h < 1) {
          throw new Error('Preset height and width must be greater than 1.')
        }
        return this.imageSvc.crop(imageSource, w, h, x, y)
      }
      throw new Error('Preset not found')
    })
    const showPreview = (image: string) =>
      this.overlay.show(this.preview, { image, resize: true })
    const showError = (err: Error) =>
      this.overlay.show(this.previewError, { $implicit: err.message })

    this.imagePreset.presets
      .pipe(take(1), generatePreview)
      .subscribe(showPreview, showError)
  }

  get gridColumnStyle() {
    return `repeat(${this.columns}, max-content)`
  }

  private initializeSelectedPresets() {
    const defaultPreset$ = this.imagePreset.presets.pipe(
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
