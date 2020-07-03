import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-root',
  template: `
    <header class="title">Batch Crop Tool</header>
    <div class="container">
      <!-- TODO - linear="true" -->
      <mat-horizontal-stepper labelPosition="bottom" #stepper>
        <mat-step [stepControl]="firstFormGroup">
          <form [formGroup]="firstFormGroup" [style.height]="'100%'">
            <ng-template matStepLabel>Configure</ng-template>
            <app-crop-presets></app-crop-presets>
            <input type="hidden" formControlName="firstCtrl" required />
            <div class="stepper-buttons">
              <button mat-button matStepperNext>Next</button>
            </div>
          </form>
        </mat-step>
        <mat-step [stepControl]="secondFormGroup">
          <form [formGroup]="secondFormGroup">
            <ng-template matStepLabel>Add Images</ng-template>
            <app-image-selector-picker #picker></app-image-selector-picker>
            <input type="hidden" formControlName="secondCtrl" required />
            <div class="stepper-buttons">
              <button mat-button matStepperPrevious>Back</button>
              <button mat-button matStepperNext>Next</button>
            </div>
          </form>
        </mat-step>
        <mat-step [stepControl]="thirdFormGroup">
          <form [formGroup]="thirdFormGroup">
            <ng-template matStepLabel>Crop Images</ng-template>
            <app-image-selector-viewer
              #viewer
              [images]="picker.images"
              (remove)="picker.remove($event)"
            ></app-image-selector-viewer>
            <input type="hidden" formControlName="thirdCtrl" required />
            <div class="stepper-buttons">
              <button mat-button matStepperPrevious>Back</button>
              <button mat-button matStepperNext>Next</button>
            </div>
          </form>
        </mat-step>
        <mat-step [stepControl]="fourthFormGroup">
          <form [formGroup]="fourthFormGroup">
            <ng-template matStepLabel>Finish</ng-template>
            <app-image-processor
              [images]="viewer.croppedImages"
            ></app-image-processor>
            <input type="hidden" formControlName="fourthCtrl" required />
            <div class="stepper-buttons">
              <!-- TODO - Reset to add images -->
              <button mat-button color="warn">Reset</button>
              <button mat-button matStepperPrevious>Back</button>
            </div>
          </form>
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
export class AppComponent implements OnInit {
  // TODO - Link components with the form groups
  firstFormGroup: FormGroup
  secondFormGroup: FormGroup
  thirdFormGroup: FormGroup
  fourthFormGroup: FormGroup

  constructor(private formBuilder: FormBuilder) {}
  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.compose([Validators.required])]
    })
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ''
    })
    this.thirdFormGroup = this.formBuilder.group({
      thirdCtrl: ''
    })
    this.fourthFormGroup = this.formBuilder.group({
      fourthCtrl: ''
    })
  }
}
