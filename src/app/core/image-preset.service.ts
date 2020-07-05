import { Injectable, OnDestroy } from '@angular/core'
import {
  BehaviorSubject,
  combineLatest,
  concat,
  EMPTY,
  from,
  Observable,
  of,
  pipe,
  Subscription,
  throwError
} from 'rxjs'
import {
  catchError,
  count,
  elementAt,
  filter,
  map,
  max,
  mergeAll,
  mergeMap,
  pluck,
  shareReplay,
  switchMap,
  take,
  tap,
  toArray
} from 'rxjs/operators'

import { IdbService } from './idb.service'

export const initialPreset = {
  default: true,
  name: 'Default',
  width: 250,
  height: 175
}

export class CropPreset {
  id: number
  default = false
  name = ''
  width = 1
  height = 1
  'x-offset' = 0
  'y-offset' = 0
  constructor(initialValues?: Partial<CropPreset>) {
    if (initialValues) {
      Object.assign(this, initialValues)
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class ImagePresetService implements OnDestroy {
  presets: Observable<CropPreset[]>
  generateId = generateId()

  private presets$ = new BehaviorSubject<CropPreset[]>([])
  private presetOrderSub: Subscription

  constructor(private idb: IdbService) {
    const dbUpdatePresetOrder = () => {
      this.presetOrderSub = this.presets$
        .pipe(
          switchMap(presets => from(presets).pipe(pluck('id'), toArray())),
          mergeMap(value => this.idb.db.metadata.put({ key: 'order', value }))
        )
        .subscribe()
    }
    const initialPresetOrder = from(
      this.idb.db.metadata.add({ key: 'order', value: [0] })
    ).pipe(
      catchError(err =>
        err?.name === 'ConstraintError'
          ? of(null)
          : throwError(new Error('IDB initialization failed.'))
      )
    )
    this.presets = this.presets$.asObservable()
    this.addPreset(initialPreset, false)
    initialPresetOrder
      .pipe(
        mergeMap(() => this.initPresetDb()),
        tap(dbUpdatePresetOrder)
      )
      .subscribe()
  }
  ngOnDestroy() {
    this.presetOrderSub?.unsubscribe()
  }

  setAsDefault(index: number) {
    const onlyOneDefault = pipe(
      map((preset: CropPreset, i) =>
        index === i
          ? { ...preset, default: true }
          : { ...preset, default: false }
      ),
      toArray(),
      tap(presets => this.presets$.next(presets))
    )
    const presets$ = this.presets$.pipe(take(1), mergeAll(), shareReplay())
    const appDefaultPreset = presets$.pipe(onlyOneDefault)
    const oldDefault$ = presets$.pipe(
      filter(({ default: isDefault }) => isDefault),
      pluck('id')
    )
    const newDefault$ = presets$.pipe(elementAt(index), pluck('id'))
    const dbDefaultPreset = combineLatest([oldDefault$, newDefault$]).pipe(
      mergeMap(([oldDefault, newDefault]) =>
        this.idb.db.transaction('rw', this.idb.db.presets, () =>
          Promise.resolve()
            .then(() =>
              this.idb.db.presets.update(oldDefault, { default: false })
            )
            .then(() =>
              this.idb.db.presets.update(newDefault, { default: true })
            )
        )
      )
    )
    concat(appDefaultPreset, dbDefaultPreset).subscribe()
  }
  addPreset(partialPreset: Partial<CropPreset> = {}, updateDb = true) {
    const id = this.generateId.next().value as number
    const preset = new CropPreset({ ...partialPreset, id })
    const addPresetToDb = new Observable(() => {
      this.idb.db.presets.add(preset)
    })
    const appAddPreset = this.presets$.pipe(
      take(1),
      tap(presets => this.presets$.next([...presets, preset]))
    )
    const dbAddPreset = updateDb ? addPresetToDb : EMPTY
    concat(appAddPreset, dbAddPreset).subscribe()
  }
  updatePreset(key: string, value: any, index: number) {
    const updatePresetAtIndex = map((presets: CropPreset[]) => {
      const newPresets = [...presets]
      newPresets[index] = { ...presets[index], [key]: value }
      return newPresets
    })
    const updatePresetDbById = mergeMap(({ id }) =>
      this.idb.db.presets.update(id, { [key]: value })
    )
    const presets$ = this.presets$.pipe(take(1), shareReplay())
    const appUpdatePreset = presets$.pipe(
      updatePresetAtIndex,
      tap(presets => this.presets$.next(presets))
    )
    const dbUpdatePreset = presets$.pipe(
      mergeAll(),
      elementAt(index),
      updatePresetDbById
    )
    concat(appUpdatePreset, dbUpdatePreset).subscribe()
  }
  removePreset(index: number) {
    const deletePresetDbById = mergeMap(({ id }) =>
      this.idb.db.presets.delete(id)
    )
    const presets$ = this.presets$.pipe(take(1), shareReplay())
    const appRemovePreset = presets$.pipe(
      mergeAll(),
      filter((_, i) => index !== i),
      toArray(),
      tap(presets => this.presets$.next(presets))
    )
    const dbRemovePreset = presets$.pipe(
      mergeAll(),
      elementAt(index),
      deletePresetDbById
    )
    concat(appRemovePreset, dbRemovePreset).subscribe()
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

  private initPresetDb() {
    const setNextPresetId = mergeMap((presets: CropPreset[]) =>
      from(presets).pipe(
        pluck('id'),
        max(),
        tap(id => this.generateId.next(id).value)
      )
    )
    const sortPresets = mergeMap(
      ([presetOrder, presets]: [number[], CropPreset[]]) =>
        from(presetOrder).pipe(
          map(presetId => presets.find(({ id }) => id === presetId)),
          toArray()
        )
    )
    const getPresetDataFromDb = mergeMap(() =>
      combineLatest([
        from(this.idb.db.metadata.get('order')).pipe(pluck('value')),
        from(this.idb.db.presets.toArray())
      ])
    )
    const initPresetDb = mergeMap(dbPresetCount => {
      const populateDb = mergeMap((presets: CropPreset[]) =>
        from(presets).pipe(
          mergeMap(appPreset => this.idb.db.presets.add(appPreset)),
          count()
        )
      )
      return dbPresetCount === 0
        ? this.presets$.pipe(take(1), populateDb)
        : of(dbPresetCount)
    })
    const initDbCallback = () =>
      from(this.idb.db.presets.count())
        .pipe(
          initPresetDb,
          getPresetDataFromDb,
          sortPresets,
          tap((presets: CropPreset[]) => this.presets$.next(presets)),
          setNextPresetId
        )
        .toPromise()
    return this.idb.db.transaction(
      'rw',
      [this.idb.db.metadata, this.idb.db.presets],
      initDbCallback
    )
  }
}

/**
 * Call next() with a number to set the value.
 * @param initialValue defaults to 0
 */
function* generateId(initialValue = 0) {
  for (let rv, i = initialValue; ; ++i) {
    rv = typeof rv === 'number' ? yield (i = rv) : yield i
  }
}
