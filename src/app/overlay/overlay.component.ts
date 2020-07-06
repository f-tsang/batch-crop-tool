import { Component, ElementRef, HostListener, ViewChild } from '@angular/core'

import { OverlayService } from '../core/overlay.service'

@Component({
  selector: 'app-overlay',
  template: `
    <div
      #overlayContainer
      class="overlay-container"
      *ngIf="visible | async"
      (click)="closeOnClick($event.target)"
    >
      <div [style.position]="'relative'">
        <ng-container
          *ngTemplateOutlet="overlay.template; context: overlay.context"
        ></ng-container>
        <button class="close-button" (click)="overlay.hide()" mat-icon-button>
          <mat-icon>close</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
      .overlay-container {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: grid;
        align-items: center;
        justify-content: center;
        overflow: auto;
        background: rgba(0, 0, 0, 0.5);
      }
      .close-button {
        /* NOTE: Same as .remove-button in image-selector-viewer.component */
        all: unset;
        position: absolute;
        right: 0;
        top: 0;
        display: grid;
        align-items: center;
        align-content: center;
        justify-content: center;
        height: 2.5rem;
        width: 2.5rem;
        text-shadow: 0px 0px 0.125rem white, 0px 0px 0.25rem white;
      }
      .close-button:hover {
        color: red;
      }
    `
  ]
})
export class OverlayComponent {
  @ViewChild('overlayContainer')
  container: ElementRef

  visible = this.overlay.visible // TBD: Why does using a variable work?

  constructor(public overlay: OverlayService) {}

  @HostListener('click', ['$event.target'])
  closeOnClick(event: EventTarget) {
    if (event === this?.container?.nativeElement) {
      this.overlay.hide()
    }
  }
}
