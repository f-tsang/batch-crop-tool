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
import {
  combineLatest,
  from,
  Observable,
  ReplaySubject,
  Subscription,
  throwError,
  zip
} from 'rxjs'
import {
  catchError,
  count,
  distinctUntilChanged,
  filter,
  first,
  map,
  mergeAll,
  mergeMap,
  switchMap,
  take,
  toArray
} from 'rxjs/operators'
import {
  CropPreset,
  ImagePresetService
} from 'src/app/core/image-preset.service'
import { ImageService } from 'src/app/core/image.service'
import { OverlayService } from 'src/app/core/overlay.service'

// TBD: Move directives into a separate file.

/**
 * TBD: Rename as FixFormFieldDirective [fixFormField].
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
    <div
      [style]="{
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center'
      }"
    >
      <mat-icon>view_column</mat-icon>
      <span class="cdk-visually-hidden">Number of columns</span>
      <mat-slider
        color="primary"
        thumbLabel="true"
        tickInterval="1"
        min="1"
        max="5"
        [style]
        [value]="columns"
        (valueChange)="updateColumns($event)"
      ></mat-slider>
    </div>
    <div class="grid" [style.grid-template-columns]="gridColumnStyle">
      <div
        #card
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
        <div class="controls" *ngIf="selectedPresets | async; let selected">
          <!-- Preview image button -->
          <button
            (click)="showPreviewImage(image, selected[i])"
            mat-icon-button
          >
            <mat-icon>image</mat-icon>
          </button>
          <!-- Select crop preset field -->
          <mat-form-field [style.width]="'100%'" appFix>
            <mat-select
              [value]="selected[i]"
              (valueChange)="updateSelectedPresets($event, i)"
            >
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
    <ng-template #preview let-imageSource="image" let-resizeImage="resize">
      <img [src]="imageSource" [appResizable]="resizeImage" />
      <p [style.text-align]="'center'">
        <i [style]="'padding: 2px 4px; background: rgba(255, 255, 255, 0.8);'"
          >Click to enable/disable scrollbars</i
        >
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
  selectedPresets = new ReplaySubject<number[]>(1)
  croppedImages = new ReplaySubject<string[]>(1)

  private defaultPresetSub: Subscription
  private croppedImagesSub: Subscription

  constructor(
    public imagePreset: ImagePresetService,
    private imageSvc: ImageService,
    private overlay: OverlayService,
    private el: ElementRef
  ) {}
  ngOnInit() {
    this.initializeSelectedPresets()
    this.initializeCroppedImages()
  }
  ngAfterViewInit() {
    this.updateImageWidth()
  }
  ngOnDestroy() {
    this?.defaultPresetSub.unsubscribe()
    this?.croppedImagesSub.unsubscribe()
  }
  trackByItem<T>(_: number, item: T) {
    return item
  }

  updateColumns(columns: number) {
    this.columns = columns
    this.updateImageWidth()
  }
  updateImageWidth() {
    if (this.el?.nativeElement?.clientWidth) {
      this.imageWidth = `${this.el.nativeElement.clientWidth / this.columns}px`
    }
  }
  updateSelectedPresets(value: number, index: number) {
    this.selectedPresets
      .pipe(
        take(1),
        map(presets => {
          const newPresets = [...presets]
          newPresets[index] = value
          return newPresets
        })
      )
      .subscribe(presets => this.selectedPresets.next(presets))
  }
  showPreviewImage(imageSource: string, cropPresetId: number) {
    const generatePreview = mergeMap((preset: CropPreset) =>
      this.cropImage(imageSource, preset)
    )
    const showPreview = (image: string) =>
      this.overlay.show(this.preview, { image, resize: true })
    const showError = (err: Error) =>
      this.overlay.show(this.previewError, { $implicit: err.message })

    this.findPreset(cropPresetId)
      .pipe(generatePreview)
      .subscribe(showPreview, showError)
  }
  findPreset(presetId: number) {
    return this.imagePreset.presets.pipe(
      take(1),
      mergeAll(),
      first(({ id }) => id === presetId),
      catchError(() => throwError(new Error('Preset not found')))
    )
  }
  cropImage(image: string, preset: CropPreset) {
    const { width: w, height: h, 'x-offset': x, 'y-offset': y } = preset
    if (w < 1 || h < 1) {
      throw new Error('Preset height and width must be greater than 1.')
    }
    return this.imageSvc.crop(image, w, h, x, y)
  }

  get gridColumnStyle() {
    return `repeat(${this.columns}, 1fr)`
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
      .subscribe(defaultPresets => this.selectedPresets.next(defaultPresets))
  }
  private initializeCroppedImages() {
    const cropImageUsingPreset = mergeMap(([image, presetId]) =>
      this.findPreset(presetId).pipe(
        mergeMap(preset => this.cropImage(image, preset))
      )
    )
    this.croppedImagesSub = combineLatest([this.images, this.selectedPresets])
      .pipe(
        filter(([images, presetIds]) => images.length === presetIds.length),
        mergeMap(([images, presetIds]) =>
          zip(from(images), from(presetIds)).pipe(
            cropImageUsingPreset,
            toArray()
          )
        )
      )
      .subscribe(images => this.croppedImages.next(images))
  }
}
