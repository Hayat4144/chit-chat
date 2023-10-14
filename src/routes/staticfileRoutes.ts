import express from 'express';
import { staticImage, staticImagePreview } from 'staticFile/staticfile';
const staticFileRouter = express.Router();

staticFileRouter.get('/uploads/images/:filename', staticImage);
staticFileRouter.get('/uploads/preview/:filename', staticImagePreview);

export default staticFileRouter;
