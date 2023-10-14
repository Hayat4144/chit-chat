import asyncHandler from '@utils/asyncHandler';
import { Response, Request } from 'express';
import { createReadStream } from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'uploads');

const staticImage = asyncHandler(async (req: Request, res: Response) => {
  const { filename } = req.params;
  const filePath = path.join(dir, 'images', filename);
  const readStream = createReadStream(filePath);
  readStream.on('error', (error) => {
    if ((error as any).code === 'ENOENT') {
      res.status(404).send('File not found');
    } else {
      res.status(500).send('Internal Server Error');
    }
  });
  res.setHeader('Content-Disposition', `inline; filename=${filename}`);
  readStream.on('data', (chunk) => res.write(chunk));
  readStream.on('end', () => res.send());
});

const staticImagePreview = asyncHandler(async (req: Request, res: Response) => {
  const { filename } = req.params;
  const filePath = path.join(dir, 'preview', filename);
  const readStream = createReadStream(filePath);
  readStream.on('error', (error) => {
    if ((error as any).code === 'ENOENT') {
      res.status(404).send('File not found');
    } else {
      res.status(500).send('Internal Server Error');
    }
  });
  res.setHeader('Content-Disposition', `inline; filename=${filename}`);
  readStream.on('data', (chunk) => res.write(chunk));
  readStream.on('end', () => res.send());
});

export { staticImage, staticImagePreview };
