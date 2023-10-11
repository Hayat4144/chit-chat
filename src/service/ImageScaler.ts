import { Resolveresponse, httpStatusCode } from '@customtype/index';
import { CustomError } from '@utils/CustomError';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

interface ImageScalar {
  scale(file: Express.Multer.File, max_width: number): Promise<Resolveresponse>;
  supported(mime_type: string): boolean;
}

class sharpImageScaler implements ImageScalar {
  async scale(
    file: Express.Multer.File,
    max_width: number,
  ): Promise<Resolveresponse> {
    return new Promise(async (resolve, reject) => {
      if (!this.supported(file.mimetype)) {
        throw new CustomError(
          `${file.mimetype} does not supported`,
          httpStatusCode.BAD_REQUEST,
        );
      }
      const public_id = randomUUID();
      const destination = `uploads/preview/${public_id}.png`;
      const resizedImageBuffer = await sharp(file.buffer)
        .resize(max_width)
        .withMetadata({ orientation: undefined })
        .toFile(destination);
      if (resizedImageBuffer) {
        resolve({ url: destination, public_id });
      } else {
        reject('Something went wrong');
      }
    });
  }

  supported(mime_type: string): boolean {
    return (
      mime_type === 'image/jpeg' ||
      mime_type === 'image/png' ||
      mime_type === 'image/gif' ||
      mime_type === 'image/jpg'
    );
  }
}

export { ImageScalar, sharpImageScaler };
