import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSelectorViewerComponent } from './image-selector-viewer.component';

describe('ImageSelectorViewerComponent', () => {
  let component: ImageSelectorViewerComponent;
  let fixture: ComponentFixture<ImageSelectorViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageSelectorViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSelectorViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
