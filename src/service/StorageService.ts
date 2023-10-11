import { createWriteStream } from 'fs';
import { Readable } from 'stream';
import { v2 as cloudinary } from 'cloudinary';
import { randomUUID } from 'crypto';
import path from 'path';

interface Attachment {
  user_id: string;
  local_path: Express.Multer.File;
  preview_path?: Express.Multer.File;
  attachment_id?: string;
}

interface ReturnPromise {
  url: string;
  public_id: string;
}

interface Storage {
  upload(attachment: Attachment): Promise<ReturnPromise>;
}

class FolderGeneratorFactory {
  private folderpath: { [key: string]: string } = {};

  register(mime_type: string, path: string) {
    this.folderpath[mime_type] = path;
  }

  getpath(mime_type: string) {
    return this.folderpath[mime_type];
  }
}

class cloudinaryStorage implements Storage {
  async upload(attachment: Attachment): Promise<ReturnPromise> {
    return new Promise(async (resolve, reject) => {
      const readableStream = Readable.from(attachment.local_path.buffer);
      const stream = cloudinary.uploader.upload_stream(
        { unique_filename: true, folder: 'chat', chunk_size: 1000000 },
        (error, data) =>
          error
            ? reject(error)
            : !data
            ? reject('something went wrong')
            : resolve({ url: data.secure_url, public_id: data.public_id }),
      );
      readableStream.pipe(stream);
    });
  }
}

class localStorage implements Storage {
  private readonly folderFactory: FolderGeneratorFactory;
  private folderPath: string | null;
  constructor(folderfactory: FolderGeneratorFactory) {
    this.folderFactory = folderfactory;
    this.folderPath = null;
  }

  async upload(attachment: Attachment): Promise<ReturnPromise> {
    return new Promise(async (resolve, reject) => {
      const readableStream = Readable.from(attachment.local_path.buffer);
      const public_id = randomUUID();
      const filepath = this.folderFactory.getpath(
        attachment.local_path.mimetype,
      );
      path
        ? (this.folderPath = filepath)
        : (this.folderPath = 'uploads/images');
      const destination = `${this.folderPath}/${public_id}${path.extname(
        attachment.local_path.originalname,
      )}`;
      const writeStream = createWriteStream(destination);
      readableStream.pipe(writeStream);

      writeStream.on('finish', () => {
        resolve({ url: destination, public_id });
      });

      writeStream.on('error', (error) => reject(error));
    });
  }
}

export {
  cloudinaryStorage,
  localStorage,
  Storage,
  Attachment,
  FolderGeneratorFactory,
};
