import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core'
import { BehaviorSubject, from, fromEvent, pipe, Subscription } from 'rxjs'
import {
  filter,
  map,
  mergeAll,
  mergeMap,
  pluck,
  switchMap,
  take,
  tap,
  toArray,
  withLatestFrom
} from 'rxjs/operators'

@Component({
  selector: 'app-image-selector-picker',
  template: `
    <div>
      <mat-icon
        [ngStyle]="{ 'font-size': '3rem', height: 'unset', width: 'unset' }"
        >landscape</mat-icon
      >
    </div>
    <input
      #input
      type="file"
      accept="image/*"
      multiple
      [style.display]="'none'"
    />
    <button color="primary" (click)="input.click()" mat-flat-button>
      Add images
    </button>
  `,
  styles: [
    `
      :host {
        padding: 2rem 0;
        display: grid;
        align-items: center;
        align-content: center;
        justify-items: center;
        justify-content: center;
        border: 0.125rem dashed rgba(0, 0, 0, 0.25);
      }
    `
  ]
})
export class ImageSelectorPickerComponent implements AfterViewInit, OnDestroy {
  @Output()
  images = new BehaviorSubject<string[]>([])
  @ViewChild('input')
  input: ElementRef<HTMLInputElement>

  private inputSub: Subscription

  ngAfterViewInit() {
    if (this.input?.nativeElement) {
      this.inputSub = fileInputToObservable(this.input.nativeElement)
        .pipe(
          withLatestFrom(this.images),
          map(([newImages, oldImages]) => [...oldImages, ...newImages]),
          tap(() => setTimeout(() => (this.input.nativeElement.value = '')))
        )
        .subscribe(this.images)
    }
  }
  ngOnDestroy() {
    this.inputSub?.unsubscribe()
  }

  remove(index: number) {
    const removeFromArray = pipe(
      mergeAll(),
      filter((_, i) => i !== index),
      toArray()
    )
    this.images
      .pipe(take(1), removeFromArray)
      .subscribe(this.images.next.bind(this.images))
  }
  reset() {
    this.images.next([])
  }
}

export function fileInputToObservable(input: HTMLInputElement) {
  const fileListToDataUrls = (fileList: FileList) => {
    const fileToDataUrl = mergeMap((file: File) => {
      const reader = new FileReader()
      const readerDataUrl = fromEvent(reader, 'load').pipe(
        take(1),
        pluck<Event, string>('target', 'result')
      )
      reader.readAsDataURL(file)
      return readerDataUrl
    })
    return from(fileList).pipe(fileToDataUrl, toArray())
  }
  return fromEvent(input, 'change').pipe(
    pluck<Event, FileList>('target', 'files'),
    switchMap(fileListToDataUrls)
  )
}
