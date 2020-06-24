import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSelectorPickerComponent } from './image-selector-picker.component';

describe('ImageSelectorPickerComponent', () => {
  let component: ImageSelectorPickerComponent;
  let fixture: ComponentFixture<ImageSelectorPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageSelectorPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSelectorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
