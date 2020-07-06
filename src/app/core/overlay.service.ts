import { DOCUMENT } from '@angular/common'
import { Inject, Injectable, OnDestroy, TemplateRef } from '@angular/core'
import { BehaviorSubject, fromEvent, Observable } from 'rxjs'
import { delay, filter, switchMap } from 'rxjs/operators'

interface Context {
  $implicit?: any
  [key: string]: any
}

@Injectable({
  providedIn: 'root'
})
export class OverlayService implements OnDestroy {
  template: TemplateRef<any>
  context: Context
  visible: Observable<boolean>

  private visible$ = new BehaviorSubject(false)
  private visibleSub = this.visible$
    .pipe(
      filter(Boolean),
      switchMap(() => fromEvent(this.document, 'keydown')),
      filter<KeyboardEvent>(({ key }) => key === 'Escape')
    )
    .subscribe(() => this.visible$.next(false))

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.visible = this.visible$.asObservable().pipe(delay(0))
  }
  ngOnDestroy() {
    this.visibleSub?.unsubscribe()
  }

  show(template: TemplateRef<any>, context: Context = {}) {
    this.template = template
    this.context = context
    this.visible$.next(true)
  }
  hide() {
    this.visible$.next(false)
  }
}
