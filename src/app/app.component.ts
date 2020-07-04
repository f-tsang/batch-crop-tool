import { Component, OnDestroy, ViewChild } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { MatStepper } from '@angular/material/stepper'
import { from } from 'rxjs'
import { count, distinctUntilChanged, filter } from 'rxjs/operators'

import {
  ImageSelectorPickerComponent
} from './image-selector/image-selector-picker/image-selector-picker.component'

@Component({
  selector: 'app-root',
  template: `
    <header class="title">Batch Crop Tool</header>
    <!-- TODO - Refactor into crop-tool-stepper component -->
    <div class="container">
      <mat-horizontal-stepper linear="true" labelPosition="bottom">
        <mat-step>
          <ng-template matStepLabel>Configure</ng-template>
          <app-crop-presets></app-crop-presets>
          <div class="stepper-buttons">
            <button mat-button matStepperNext>Next</button>
          </div>
        </mat-step>
        <mat-step [stepControl]="pickerFormGroup">
          <form [formGroup]="pickerFormGroup">
            <ng-template matStepLabel>Add Images</ng-template>
            <app-image-selector-picker
              #picker
              (images)="updateImageCount($event)"
            ></app-image-selector-picker>
            <div class="stepper-buttons">
              <button mat-button matStepperPrevious>Back</button>
              <button
                mat-button
                matStepperNext
                [disabled]="pickerFormGroup.invalid"
              >
                Next
              </button>
            </div>
          </form>
        </mat-step>
        <mat-step>
          <ng-template matStepLabel>Crop Images</ng-template>
          <app-image-selector-viewer
            #viewer
            [images]="picker.images"
            (remove)="picker.remove($event)"
          ></app-image-selector-viewer>
          <div class="stepper-buttons">
            <button mat-button matStepperPrevious>Back</button>
            <button mat-button matStepperNext>Next</button>
          </div>
        </mat-step>
        <mat-step>
          <ng-template matStepLabel>Finish</ng-template>
          <app-image-processor
            [images]="viewer.croppedImages"
          ></app-image-processor>
          <div class="stepper-buttons">
            <button mat-button matStepperPrevious>Back</button>
            <button mat-button color="warn" (click)="resetStepper()">
              Reset
            </button>
          </div>
        </mat-step>
      </mat-horizontal-stepper>
    </div>
    <!-- Overlay -->
    <app-overlay></app-overlay>
  `,
  styles: [
    `
      :host {
        display: grid;
        grid-auto-columns: 40rem;
        grid-auto-rows: max-content;
        justify-content: center;
        height: 100%;
        background: gainsboro;
        overflow: auto;
      }
      .title {
        margin-top: 16px;
        text-align: center;
        font-size: 36px;
        font-family: 'Lucida Sans Unicode', 'Lucida Grande', sans-serif;
      }
      .container {
        margin: 16px 0;
        overflow: hidden;
        box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.4);
        border-radius: 4px;
        background: whitesmoke;
      }
      .stepper-buttons {
        margin-top: 24px;
        display: grid;
        grid-auto-flow: column;
      }
    `
  ]
})
export class AppComponent implements OnDestroy {
  @ViewChild(MatStepper)
  stepper: MatStepper
  @ViewChild(ImageSelectorPickerComponent)
  picker: ImageSelectorPickerComponent

  // TBD: Form group components for more granular form validation.
  pickerFormGroup = this.formBuilder.group({
    imageCount: [
      0,
      Validators.compose([Validators.required, Validators.min(1)])
    ]
  })

  private imageCountSub = this.pickerFormGroup.statusChanges
    .pipe(
      filter(() => Boolean(this.stepper)),
      distinctUntilChanged()
    )
    .subscribe((valid: string) =>
      valid === 'VALID' ? this.stepper.next() : this.resetStepper()
    )

  constructor(private formBuilder: FormBuilder) {}
  ngOnDestroy() {
    this.imageCountSub.unsubscribe()
  }

  updateImageCount(images: string[]) {
    from(images)
      .pipe(count())
      .subscribe(imageCount => this.pickerFormGroup.patchValue({ imageCount }))
  }
  resetStepper() {
    if (this.picker && this.stepper) {
      this.picker.reset()
      this.stepper.reset()
      this.stepper.selectedIndex = 1
    }
  }
}
