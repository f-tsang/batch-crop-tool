import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CropPresetsComponent } from './crop-presets.component'

describe('CropPresetsComponent', () => {
  let component: CropPresetsComponent
  let fixture: ComponentFixture<CropPresetsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CropPresetsComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CropPresetsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
