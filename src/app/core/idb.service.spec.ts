import { TestBed } from '@angular/core/testing'

import { IdbService } from './idb.service'

describe('IdbServiceService', () => {
  let service: IdbService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(IdbService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
