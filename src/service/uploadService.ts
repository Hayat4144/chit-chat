import { Resolveresponse, httpStatusCode } from '@customtype/index';
import { ImageScalar } from './ImageScaler';
import { PreviewGeneratoryFactory } from './PreviewGeneratorFactory';
import { Attachment, Storage } from './StorageService';

class uploadService {
  private readonly storage: Storage;
  private readonly scaler: ImageScalar;
  private readonly preview_factory: PreviewGeneratoryFactory;
  preview_response: Resolveresponse | null;

  constructor(
    storage: Storage,
    scaler: ImageScalar,
    preview_factory: PreviewGeneratoryFactory,
  ) {
    this.storage = storage;
    this.scaler = scaler;
    this.preview_factory = preview_factory;
    this.preview_response = null;
  }

  async uploadMedia(attachment: Attachment, mime_type: string) {
    const preview_generator = this.preview_factory.generate(mime_type);
    if (preview_generator) {
      const preview_image = await preview_generator.generator<Resolveresponse>(
        attachment.local_path,
      );
      this.preview_response = preview_image;
    }
    const uplaodedFile = await this.storage.upload(attachment);
    return {
      preview_image: this.preview_response,
      image_response: uplaodedFile,
    };
  }
}

export { uploadService };
