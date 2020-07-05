import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CropToolStepperComponent } from './crop-tool-stepper.component';

describe('CropToolStepperComponent', () => {
  let component: CropToolStepperComponent;
  let fixture: ComponentFixture<CropToolStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CropToolStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CropToolStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
