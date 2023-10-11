import { ImageScalar } from './ImageScaler';
import gm from 'gm';
import { Readable } from 'stream';
import { randomUUID } from 'crypto';
import { Resolveresponse, httpStatusCode } from '@customtype/index';
import { createWriteStream } from 'fs';

interface PreviewGenerator {
  generator<T>(file: Express.Multer.File): Promise<Resolveresponse>;
}

class ImagePreviewGenerator implements PreviewGenerator {
  private readonly scaler: ImageScalar;
  private readonly Max_Width_Px = 2500;
  constructor(scaler: ImageScalar) {
    this.scaler = scaler;
  }
  async generator(file: Express.Multer.File): Promise<Resolveresponse> {
    const resized_image = await this.scaler.scale(file, this.Max_Width_Px);
    return resized_image;
  }
}


class PdfPreviewGenerator implements PreviewGenerator {
  async generator(file: Express.Multer.File): Promise<Resolveresponse> {
    return new Promise((resolve, reject) => {
      const readableStream = Readable.from(file.buffer);
      const public_id = randomUUID();
      const destination = `uploads/preview/${public_id}.png`;
      gm(readableStream)
        .selectFrame(0)
        .resize(250)
        .write(`${destination}`, (error) =>
          error
            ? reject(error.message)
            : resolve({ url: destination, public_id }),
        );
    });
  }
}

export {
  ImagePreviewGenerator,
  PreviewGenerator,
  PdfPreviewGenerator,
};
