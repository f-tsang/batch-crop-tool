import { Component } from '@angular/core'

import { ImagePresetService } from '../core/image-preset.service'

export const cropDimensions = ['width', 'height', 'x-offset', 'y-offset']

@Component({
  selector: 'app-crop-presets',
  template: `
    <header>1 - Presets</header>
    <div class="preset-list">
      <div
        class="preset-option"
        *ngFor="
          let preset of imagePreset.presets | async;
          let i = index;
          let first = first;
          let last = last;
          trackBy: trackById
        "
      >
        <button
          [style.color]="preset['default'] ? 'green' : 'initial'"
          (click)="imagePreset.setAsDefault(i)"
          aria-label="Set as default"
          mat-icon-button
        >
          <ng-container
            *ngIf="preset['default']; then defaultPreset; else altPreset"
          ></ng-container>
          <ng-template #defaultPreset>
            <mat-icon>radio_button_checked</mat-icon>
          </ng-template>
          <ng-template #altPreset>
            <mat-icon>radio_button_unchecked</mat-icon>
          </ng-template>
        </button>
        <mat-form-field>
          <mat-label>Name</mat-label>
          <input
            matInput
            [value]="preset['name'] || ''"
            (change)="imagePreset.updatePreset('name', $event.target.value, i)"
          />
        </mat-form-field>
        <div class="preset-numbers">
          <mat-form-field *ngFor="let cropDim of cropDimensions">
            <mat-label>{{ cropDim | titlecase }}</mat-label>
            <input
              type="number"
              [value]="preset[cropDim] || ''"
              (change)="updateCropDimension(cropDim, $event.target.value, i)"
              matInput
            />
          </mat-form-field>
        </div>
        <div class="preset-controls">
          <div [style.display]="'flex'">
            <button
              [disabled]="first"
              (click)="imagePreset.movePreset(i, i - 1)"
              mat-icon-button
            >
              <mat-icon>arrow_drop_up</mat-icon>
            </button>
            <button
              [disabled]="last"
              (click)="imagePreset.movePreset(i, i + 1)"
              mat-icon-button
            >
              <mat-icon>arrow_drop_down</mat-icon>
            </button>
          </div>
          <button
            class="close-button"
            [disabled]="(first && last) || preset['default']"
            (click)="imagePreset.removePreset(i)"
            mat-icon-button
          >
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>
    </div>
    <button
      class="preset-button"
      (click)="imagePreset.addPreset()"
      mat-stroked-button
    >
      Add preset
    </button>
    <p>{{ imagePreset.presets | async | json }}</p>
  `,
  styles: [
    `
      :host {
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
export class CropPresetsComponent {
  cropDimensions = cropDimensions

  constructor(public imagePreset: ImagePresetService) {}
  trackById(_: number, { id }: any) {
    return id
  }

  updateCropDimension(key: string, value: string, index: number) {
    this.imagePreset.updatePreset(key, Number(value), index)
  }
}
