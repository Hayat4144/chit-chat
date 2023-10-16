import express from 'express';
import downloadFile from 'staticFile/downloadfile';
import { staticImage, staticImagePreview } from 'staticFile/staticfile';
const staticFileRouter = express.Router();

staticFileRouter.get('/uploads/images/:filename', staticImage);
staticFileRouter.get('/uploads/preview/:filename', staticImagePreview);
staticFileRouter.get('/downloads',downloadFile)

export default staticFileRouter;
