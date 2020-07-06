import { Injectable } from '@angular/core'
import Dexie from 'dexie'

import { CropPreset } from './image-preset.service'

export const dbName = 'BatchCropToolDb'
export const dbVersion = 1
export const dbStructure = {
  metadata: '&key',
  presets: '++id,name'
}

export class PresetDatabase extends Dexie {
  metadata: Dexie.Table<{}, string>
  presets: Dexie.Table<CropPreset, number>
  constructor() {
    super(dbName)
    this.version(dbVersion).stores(dbStructure)
    this.metadata = this.table('metadata')
    this.presets = this.table('presets')
  }
}

@Injectable({
  providedIn: 'root'
})
export class IdbService {
  db = new PresetDatabase()
}
