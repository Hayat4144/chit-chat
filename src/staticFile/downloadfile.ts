import asyncHandler from '@utils/asyncHandler';
import { Response, Request } from 'express';
import { createReadStream } from 'fs';
import path from 'path';

const downloadFile = asyncHandler(async (req: Request, res: Response) => {
  const { filename } = req.query;
  const filePath = path.join(process.cwd(), filename as string);
  const readStream = createReadStream(filePath);
  readStream.on('error', (error) => {
    if ((error as any).code === 'ENOENT') {
      res.status(404).send('File not found');
    } else {
      res.status(500).send('Internal Server Error');
    }
  });
  const fileName = filePath.split('/');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=${fileName[fileName.length - 1]}`,
  );
  readStream.on('data', (chunk) => res.write(chunk));
  readStream.on('end', () => res.send());
});

export default downloadFile;
