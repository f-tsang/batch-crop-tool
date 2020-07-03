import { Injectable } from '@angular/core'
import { BehaviorSubject, pipe } from 'rxjs'
import { filter, map, mergeAll, take, toArray } from 'rxjs/operators'

/**
 * TBD: Input type number value is a string.
 */
export class CropPreset {
  id: number
  default = false
  name = ''
  width = 0
  height = 0
  'x-offset' = 0
  'y-offset' = 0
  constructor(initialValues?: Partial<CropPreset>) {
    if (initialValues) {
      Object.assign(this, initialValues)
    }
  }
}

/**
 * TODO - R/W from IDB
 */
@Injectable({
  providedIn: 'root'
})
export class ImagePresetService {
  generateId = generateId()

  private presets$ = new BehaviorSubject<CropPreset[]>([])
  presets = this.presets$.asObservable()

  constructor() {
    this.addPreset({ default: true, name: 'Example', width: 250, height: 125 })
  }

  addPreset(partialPreset: Partial<CropPreset> = {}) {
    const id = this.generateId.next().value as number
    const preset = new CropPreset({ ...partialPreset, id })
    this.presets$
      .pipe(take(1))
      .subscribe(presets => this.presets$.next([...presets, preset]))
  }
  setAsDefault(index: number) {
    const onlyOneDefault = pipe(
      mergeAll(),
      map((preset: CropPreset, i) =>
        index === i
          ? { ...preset, default: true }
          : { ...preset, default: false }
      ),
      toArray()
    )
    this.presets$
      .pipe(take(1), onlyOneDefault)
      .subscribe(presets => this.presets$.next(presets))
  }
  updatePreset(key: string, value: any, index: number) {
    const updatePresetAtIndex = map((presets: CropPreset[]) => {
      const newPresets = [...presets]
      newPresets[index] = { ...presets[index], [key]: value }
      return newPresets
    })
    this.presets$
      .pipe(take(1), updatePresetAtIndex)
      .subscribe(presets => this.presets$.next(presets))
  }
  removePreset(index: number) {
    this.presets$
      .pipe(
        take(1),
        mergeAll(),
        filter((_, i) => index !== i),
        toArray()
      )
      .subscribe(presets => this.presets$.next(presets))
  }
  movePreset(oldIndex: number, newIndex: number) {
    const moveToIndex = map((presets: CropPreset[]) => {
      const newPresets = presets.filter((_, index) => index !== oldIndex)
      return [
        ...newPresets.slice(0, newIndex),
        presets[oldIndex],
        ...newPresets.slice(newIndex, newPresets.length)
      ]
    })
    this.presets$
      .pipe(take(1), moveToIndex)
      .subscribe(presets => this.presets$.next(presets))
  }
}

function* generateId(i = 0) {
  for (;;) {
    yield i++
  }
}
