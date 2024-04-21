import pkg from 'mongoose';
import mongoose from 'mongoose';
import express from 'express';
import fs from 'fs';

import VideoInfo from '../app/models/VideoInfo.js';
import TSFile from '../app/models/TSFile.js';

import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

import { PassThrough } from 'stream';

import videoController from '../app/controllers/VideoController.js';

const router = express.Router();

router.get('/stream/:video_id', async (req, res) => {
   const typeFile = req.query;

   if (typeFile.mode && typeFile.mode === 'm3u8') {
      try {
         const videoId = req.params.video_id;

         const videoInfo = await VideoInfo.findById(videoId);
         if (!videoInfo) {
            return res.status(404).json({ success: false, message: 'Video not found' });
         }

         res.set('Content-Type', 'application/vnd.apple.mpegurl');

         const stream = new PassThrough();

         stream.end(videoInfo.m3u8Data);

         stream.pipe(res);
      } catch (err) {
         console.log(err);
         return res.status(404).json({ success: false, message: err.message });
      }
   } else {
      try {
         const nameTSFile = req.params.video_id;

         const tsFile = await TSFile.findOne({ name: nameTSFile });
         if (!tsFile) {
            return res.status(404).json({ success: false, message: 'Video not found' });
         }

         const stream = new PassThrough();
         stream.end(tsFile.tsData);
         res.setHeader('Content-Type', 'application/octet-stream');

         stream.pipe(res);
      } catch (err) {
         console.log(err);
      }
   }
});

router.post('/convert', upload.single('video'), videoController.converMp4ToM3u8);

router.get('/thumbnail/:id', videoController.get_thumbnail);

// router.post('/register', authController.register);

// router.post('/login', authController.login);

// router.post('/login/check_account_valid', authController.checkAccountValid);

// router.post('/login/resend', verifyToken, authController.resend);

export default router;
