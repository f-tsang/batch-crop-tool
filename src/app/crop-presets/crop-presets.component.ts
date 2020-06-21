import { Component, OnInit } from '@angular/core'
import { BehaviorSubject, pipe } from 'rxjs'
import { filter, map, mergeAll, take, toArray } from 'rxjs/operators'

@Component({
  selector: 'app-crop-presets',
  template: `
    <header>Presets</header>
    <div class="preset-list">
      <div
        class="preset-option"
        *ngFor="
          let preset of presets | async;
          let i = index;
          let first = first;
          let last = last;
          trackBy: trackById
        "
      >
        <button
          [style.color]="preset['default'] ? 'green' : 'initial'"
          (click)="setDefaults(i)"
          mat-icon-button
        >
          <mat-icon>check_circle_outline</mat-icon>
        </button>
        <mat-form-field>
          <mat-label>Name</mat-label>
          <input
            matInput
            [value]="preset['name'] || ''"
            (change)="updatePreset('name', $event.target.value, i)"
          />
        </mat-form-field>
        <div class="preset-numbers">
          <mat-form-field>
            <mat-label>Width</mat-label>
            <input
              type="number"
              [value]="preset['width'] || ''"
              (change)="updatePreset('width', $event.target.value, i)"
              matInput
            />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Height</mat-label>
            <input
              type="number"
              [value]="preset['height'] || ''"
              (change)="updatePreset('height', $event.target.value, i)"
              matInput
            />
          </mat-form-field>
          <mat-form-field>
            <mat-label>X-offset</mat-label>
            <input
              type="number"
              [value]="preset['x'] || ''"
              (change)="updatePreset('x', $event.target.value, i)"
              matInput
            />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Y-offset</mat-label>
            <input
              type="number"
              [value]="preset['y'] || ''"
              (change)="updatePreset('y', $event.target.value, i)"
              matInput
            />
          </mat-form-field>
        </div>
        <div class="preset-controls">
          <div [style.display]="'flex'">
            <button
              [disabled]="first"
              (click)="movePreset(i, i - 1)"
              mat-icon-button
            >
              <mat-icon>arrow_upward</mat-icon>
            </button>
            <button
              [disabled]="last"
              (click)="movePreset(i, i + 1)"
              mat-icon-button
            >
              <mat-icon>arrow_downward</mat-icon>
            </button>
          </div>
          <button
            class="close-button"
            [disabled]="(first && last) || preset['default']"
            (click)="removePreset(i)"
            mat-icon-button
          >
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>
    </div>
    <button class="preset-button" (click)="addPreset()" mat-stroked-button>
      Add preset
    </button>
    <p>{{ presets | async | json }}</p>
  `,
  styles: [
    `
      :host {
        margin: 0 auto;
        padding: 1rem;
        display: grid;
        grid-auto-columns: auto;
        max-width: 40rem;
      }
      .preset-list {
        display: flex;
        flex-flow: column nowrap;
      }
      .preset-option {
        display: grid;
        grid: auto / min-content minmax(100px, 1fr) minmax(250px, 2fr) min-content;
        align-items: center;
        gap: 1rem;
      }
      .preset-numbers {
        display: grid;
        grid: auto / repeat(auto-fit, minmax(1rem, max-content));
        gap: 0;
      }
      .preset-controls {
        display: grid;
        grid-auto-flow: column;
        gap: 0.25rem;
      }
      .preset-button {
        margin-top: 1rem;
      }
      .close-button:hover:not(:disabled) {
        color: red;
      }
    `
  ]
})
export class CropPresetsComponent implements OnInit {
  generateId = generateId()
  presets = new BehaviorSubject<{}[]>([
    { id: this.generateId.next().value, default: true }
  ])

  constructor() {}
  ngOnInit(): void {}
  trackById(_: number, { id }: any) {
    return id
  }

  setDefaults(index: number) {
    const onlyOneDefault = pipe(
      mergeAll(),
      map((preset: {}, i) =>
        index === i
          ? { ...preset, default: true }
          : { ...preset, default: false }
      ),
      toArray()
    )
    this.presets
      .pipe(take(1), onlyOneDefault)
      .subscribe(presets => this.presets.next(presets))
  }
  addPreset() {
    const id = this.generateId.next().value
    this.presets
      .pipe(take(1))
      .subscribe(presets => this.presets.next([...presets, { id }]))
  }
  updatePreset(key: string, value: any, index: number) {
    const updatePresetAtIndex = map((presets: {}[]) => {
      const newPresets = [...presets]
      newPresets[index] = { ...presets[index], [key]: value }
      return newPresets
    })
    this.presets
      .pipe(take(1), updatePresetAtIndex)
      .subscribe(presets => this.presets.next(presets))
  }
  removePreset(index: number) {
    this.presets
      .pipe(
        take(1),
        mergeAll(),
        filter((_, i) => index !== i),
        toArray()
      )
      .subscribe(presets => this.presets.next(presets))
  }
  movePreset(oldIndex: number, newIndex: number) {
    this.presets
      .pipe(
        take(1),
        map(presets => {
          const newPresets = presets.filter((_, index) => index !== oldIndex)
          return [
            ...newPresets.slice(0, newIndex),
            presets[oldIndex],
            ...newPresets.slice(newIndex, newPresets.length)
          ]
        })
      )
      .subscribe(presets => this.presets.next(presets))
  }
}

function* generateId(i = 0) {
  for (;;) {
    yield i++
  }
}
