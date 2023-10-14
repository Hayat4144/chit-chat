import { httpStatusCode } from '@customtype/index';
import { sharpImageScaler } from '@service/ImageScaler';
import MessageService from '@service/MessageService';
import { PreviewGeneratoryFactory } from '@service/PreviewGeneratorFactory';
import {
  ImagePreviewGenerator,
  PdfPreviewGenerator,
} from '@service/PreviewGeneratorService';
import {
  Attachment,
  FolderGeneratorFactory,
  Storage,
  cloudinaryStorage,
  localStorage,
} from '@service/StorageService';
import { uploadService } from '@service/uploadService';
import asyncHandler from '@utils/asyncHandler';
import { Response, Request } from 'express';
import mongoose, { Types } from 'mongoose';

const production = process.env.NODE_ENV === 'production';
const scaler = new sharpImageScaler();

const preview_factory = new PreviewGeneratoryFactory();

const image_generator = new ImagePreviewGenerator(scaler);
preview_factory.register('image/jpg', image_generator);
preview_factory.register('image/png', image_generator);
preview_factory.register('image/gif', image_generator);
preview_factory.register('image/jpeg', image_generator);

const pdf_generator = new PdfPreviewGenerator();
preview_factory.register('application/pdf', pdf_generator);

const folderpathFactory = new FolderGeneratorFactory();
folderpathFactory.register('image/png', 'uploads/images');
folderpathFactory.register('image/jpg', 'uploads/images');
folderpathFactory.register('image/gif', 'uploads/images');
folderpathFactory.register('image/jpeg', 'uploads/images');

folderpathFactory.register('application/pdf', 'uploads/documents');
folderpathFactory.register('video/mp4', 'uploads/video');
folderpathFactory.register(
  'application/vnd.ms-powerpoint',
  'uploads/documents',
);
folderpathFactory.register(
  'application/vnd.openxmlformats',
  'uploads/documents',
);
folderpathFactory.register('text/plain', 'uploads/documents');

const messageService = new MessageService();

const Attachment = asyncHandler(async (req: Request, res: Response) => {
  const file = req.file;
  const { chatId, isGroupchat, recieverId, message } = req.body;
  console.log(req.headers);
  if (!file) {
    return res
      .status(httpStatusCode.BAD_REQUEST)
      .send({ error: 'Empty file detected.' });
  }
  let storage: Storage;
  if (production) {
    storage = new cloudinaryStorage();
  } else {
    storage = new localStorage(folderpathFactory);
  }
  const attachment: Attachment = {
    user_id: req.user_id,
    local_path: file,
  };
  const uploadRequest = new uploadService(storage, scaler, preview_factory);
  const uploadMedia = await uploadRequest.uploadMedia(
    attachment,
    file.mimetype,
  );
  const [type] = file.mimetype.split('/');
  const data = {
    sender: req.user_id,
    payload: {
      type,
      url: {
        content: message,
        file_url: uploadMedia.image_response.url,
        public_id: uploadMedia.image_response.public_id,
        preview: {
          url: uploadMedia.preview_image?.url,
          public_id: uploadMedia.preview_image?.public_id,
        },
      },
    },
  };
  if (isGroupchat) {
    const createNewMessage = await messageService.GroupMessage(
      chatId,
      data,
      req,
    );
    return res.status(httpStatusCode.OK).send({ data: createNewMessage });
  }
  const members: Types.ObjectId[] = [
    new mongoose.Types.ObjectId(req.user_id),
    new mongoose.Types.ObjectId(recieverId),
  ];
  const privateMessage = await messageService.PrivateMessage(
    members,
    data,
    false,
    req,
  );
  return res.status(httpStatusCode.OK).send({ data: privateMessage });
});

export default Attachment;
