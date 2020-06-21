import { DOCUMENT } from '@angular/common'
import { Inject, Injectable } from '@angular/core'
import { Observable, Subscriber } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  identify(src: string) {
    const emitImageProps = (subscriber: Subscriber<{}>) => {
      const image = new Image()
      image.src = src
      image.onload = () => {
        const { width, height } = image
        subscriber.next({ src, width, height })
        subscriber.complete()
      }
    }
    return new Observable(emitImageProps)
  }

  crop(src: string, width: number, height: number, x: number, y: number) {
    /**
     * Notes:
     *  - Stretches if source and destination height and width are different.
     *  - Source is where the image is placed before getting cropped.
     *  - Destination is the resulting size.
     *  - Canvas height and width determines the resulting image size.
     */
    const cropImage = (subscriber: Subscriber<string>) => {
      const canvas = Object.assign(this.document.createElement('canvas'), {
        width,
        height
      })
      const context = canvas.getContext('2d')
      const image = new Image()
      image.src = src
      image.onload = () => {
        const srcSpec = [x, y, width, height]
        const dstSpec = [0, 0, width, height]
        context?.drawImage.apply(context, [image, ...srcSpec, ...dstSpec])
        subscriber.next(canvas.toDataURL())
        subscriber.complete()
      }
    }
    return new Observable(cropImage)
  }
}
