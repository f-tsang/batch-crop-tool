import { TestBed } from '@angular/core/testing'

import { ImagePresetService } from './image-preset.service'

describe('ImagePresetServiceService', () => {
  let service: ImagePresetService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(ImagePresetService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
