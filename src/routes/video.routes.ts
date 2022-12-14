import { Response, } from 'restify';
import { Router, } from 'restify-router';
import videoController from '../controllers/video.controller';

const router = new Router();

router.get('/execute', async (req, res): Promise<Response> => {
  try {
    await videoController.executeProcessToBuildReel()
    return res.json({ success: true, });
  } catch (error) {
    return res.json({succes: false, error: error.stack})
  }
});

router.get('/ffmpeg', async (req, res): Promise<Response> => {
  try {
    await videoController.testingFfmpeg()
    return res.json({ success: true, });
  } catch (error) {
    return res.json({succes: false, error: error.stack})
  }
});

router.post('/cutvideo', async (req, res): Promise<Response> => {
  try {
    const {nameVideo, startTime, endTime, numberCpusAvailables} = req.body
    console.log("🚀 ~ file: video.routes.ts ~ line 28 ~ router.get ~ nameVideo", nameVideo)
    await videoController.cutVideo(nameVideo, startTime, endTime, numberCpusAvailables)
    return res.json({ success: true, });
  } catch (error) {
    return res.json({succes: false, error: error.stack})
  }
});

router.post('/concatvideo', async (req, res): Promise<Response> => {
  try {
    const {nameVideo1, nameVideo2, numberCpusAvailables} = req.body
    console.log("🚀 ~ file: video.routes.ts ~ line 39 ~ router.get ~ nameVideo1: %O, nameVideo2: %O", nameVideo1, nameVideo2)
    await videoController.concatVideo(nameVideo1, nameVideo2, numberCpusAvailables)
    return res.json({ success: true, });
  } catch (error) {
    return res.json({succes: false, error: error.stack})
  }
});

router.post('/uploadvideo', async (req, res): Promise<Response> => {
  try {
    const {uploadvideo, numberCpusAvailables} = req.body
    console.log("🚀 ~ file: video.routes.ts ~ line  ~ router.get ~ uploadVideo: %O", uploadvideo)
    await videoController.uploadVideo(uploadvideo, numberCpusAvailables)
    return res.json({ success: true, });
  } catch (error) {
    return res.json({succes: false, error: error.stack})
  }
});

export default router;