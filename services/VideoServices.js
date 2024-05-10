import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import fs from 'fs';
import { PassThrough } from 'stream';

import VideoInfo from '../app/models/VideoInfo.js';
import TSFile from '../app/models/TSFile.js';
import Thumbnail from '../app/models/ThumbnailVideo.js';

import ffprobe from 'ffprobe';
import ffprobeStatic from 'ffprobe-static';
import ProductDetailService from './ProductDetailService.js';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

var filename = './services/demo2.mp4';

var tempVideoRef = [];

const saveM3U8File = async (videoName, m3u8Data, quality) => {
   try {
      const videoInfo = new VideoInfo({
         name: videoName,
         m3u8Data: m3u8Data,
         quality,
      });
      const savedVideoInfo = await videoInfo.save();
      return { success: true, message: 'M3U8 file saved successfully!', _id: savedVideoInfo._id };
   } catch (error) {
      return { success: false, message: 'M3U8 file saved failed!' };
   }
};

const saveTSFile = async (videoId, tsFileName, tsData) => {
   try {
      const tsFile = new TSFile({
         videoId: videoId,
         name: tsFileName,
         tsData: tsData,
      });
      await tsFile.save();
      return { success: true, message: 'TS file saved successfully!' };
   } catch (error) {
      return { success: false, message: 'M3U8 file saved failed!' };
   }
};

const saveThumbnail = async (videoId, timemark, image) => {
   try {
      const thumbnail = new Thumbnail({
         videoId,
         timemark,
         image,
      });
      await thumbnail.save();
      return { success: true, message: 'Thumbnail saved successfully!' };
   } catch (error) {
      return { success: false, message: 'Thumbnail file saved failed!' };
   }
};

async function callback(fileName = '', filePath = '', quality) {
   try {
      fs.readFile(filePath + '/' + fileName, 'utf8', async (err, data) => {
         if (err) {
            console.error('Error:', err);
            return;
         }

         await saveM3U8File(fileName, data, quality).then(async (result) => {
            const lines = data.split('\n');

            tempVideoRef = [...tempVideoRef, { _id: result._id, quality }];

            const tsFiles = lines.filter((line) => line.endsWith('.ts'));

            await Promise.all(
               tsFiles.map(async (tsFile, index) => {
                  const tsFilePath = tsFile.trim();
                  const tsData = fs.readFileSync(filePath + '/' + tsFilePath);

                  return await saveTSFile(result._id, tsFilePath, tsData);
               }),
            ).then((result) => {
               fs.rmSync(filePath, { recursive: true, force: true });
            });
         });
      });
   } catch (err) {
      console.error(err);
   }
}

class VideoServices {
   async convert_to_m3u8(videoPath = '', videoName = '', productId = '', res) {
      var videoIDGlobal;

      var durationOfVideo = 0;

      await ProductDetailService.add({
         product_id: productId,
         title: videoName,
         description: '',
      }).then((response) => {
         videoIDGlobal = response.product_details._id;
      });

      ffprobe(videoPath, { path: ffprobeStatic.path }, function (err, info) {
         if (err) return done(err);

         durationOfVideo = info.streams[0].duration;
      });

      try {
         const timestamp = Date.now();
         const outputFolder = `./videos/${timestamp}/`;

         function timemarkToSeconds(timemark) {
            const [hours, minutes, seconds] = timemark.split(':').map(parseFloat);
            const totalSeconds = hours * 3600 + minutes * 60 + seconds;

            return totalSeconds;
         }

         return new Promise((resolve, reject) => {
            try {
               fs.mkdirSync(outputFolder, { recursive: true });

               resolve();
            } catch (err) {
               reject();
            }
         })
            .then(async () => {
               fs.mkdirSync(outputFolder + '/360', { recursive: true });

               return new Promise((resolve, reject) => {
                  ffmpeg(videoPath)
                     .addOptions([
                        //360
                        '-profile:v main',
                        '-vf scale=w=640:h=360:force_original_aspect_ratio=decrease',
                        '-c:a aac',
                        '-ar 48000',
                        '-b:a 96k',
                        '-c:v h264',
                        '-crf 20',
                        '-g 48',
                        '-keyint_min 48',
                        '-sc_threshold 0',
                        '-b:v 800k',
                        '-maxrate 856k',
                        '-bufsize 1200k',
                        '-hls_time 10',
                        `-hls_segment_filename ${outputFolder + '/360'}/${timestamp}_360p_%03d.ts`,
                        '-hls_playlist_type vod',
                        '-f hls',
                     ])
                     .on('progress', (progress) => {
                        // durationOfVideo = timemarkToSeconds(progress.timemark);

                        res.write(
                           JSON.stringify({
                              curStep: 0,
                              percent: +timemarkToSeconds(progress.timemark) / +durationOfVideo,
                              maxStep: 3,
                           }),
                        );
                        res.flushHeaders();
                     })
                     .output(`${outputFolder + '/360'}/${timestamp}_360.m3u8`)
                     .on('end', (end) => {
                        callback(`${timestamp}_360.m3u8`, outputFolder + '/360', '360p');
                        resolve();
                     })
                     .on('error', () => {
                        resolve();
                     })
                     .run();
               })
                  .then(() => {
                     fs.mkdirSync(outputFolder + '/480', { recursive: true });

                     return new Promise((resolve, reject) => {
                        ffmpeg(videoPath)
                           .addOptions([
                              //480
                              '-profile:v main',
                              '-vf scale=w=842:h=480:force_original_aspect_ratio=decrease',
                              '-c:a aac',
                              '-ar 48000',
                              '-b:a 128k',
                              '-c:v h264',
                              '-crf 20',
                              '-g 48',
                              '-keyint_min 48',
                              '-sc_threshold 0',
                              '-b:v 1400k',
                              '-maxrate 1498k',
                              '-bufsize 2100k',
                              '-hls_time 10',
                              `-hls_segment_filename ${
                                 outputFolder + '/480'
                              }/${timestamp}_480p_%03d.ts`,
                              '-hls_playlist_type vod',
                              '-f hls',
                           ])
                           .on('progress', (progress) => {
                              // durationOfVideo = timemarkToSeconds(progress.timemark);

                              res.write(
                                 JSON.stringify({
                                    curStep: 1,
                                    percent:
                                       +timemarkToSeconds(progress.timemark) / +durationOfVideo,
                                    maxStep: 3,
                                 }),
                              );
                              res.flushHeaders();
                           })
                           .output(`${outputFolder + '/480'}/${timestamp}_480.m3u8`)
                           .on('end', () => {
                              callback(`${timestamp}_480.m3u8`, outputFolder + '/480', '480p');
                              resolve();
                           })
                           .on('error', () => {
                              resolve();
                           })
                           .run();
                     });
                  })
                  .then(() => {
                     fs.mkdirSync(outputFolder + '/720', { recursive: true });

                     return new Promise((resolve, reject) => {
                        ffmpeg(videoPath)
                           .addOptions([
                              //720
                              '-profile:v main',
                              '-vf scale=w=1280:h=720:force_original_aspect_ratio=decrease',
                              '-c:a aac',
                              '-ar 48000',
                              '-b:a 128k',
                              '-c:v h264',
                              '-crf 20',
                              '-g 48',
                              '-keyint_min 48',
                              '-sc_threshold 0',
                              '-b:v 2800k',
                              '-maxrate 2996k',
                              '-bufsize 4200k',
                              '-hls_time 10',
                              `-hls_segment_filename ${
                                 outputFolder + '/720'
                              }/${timestamp}_720p_%03d.ts`,
                              '-hls_playlist_type vod',
                              '-f hls',
                           ])
                           .on('progress', (progress) => {
                              res.write(
                                 JSON.stringify({
                                    curStep: 2,
                                    percent:
                                       +timemarkToSeconds(progress.timemark) / +durationOfVideo,
                                    maxStep: 3,
                                 }),
                              );
                              res.flushHeaders();
                           })
                           .output(`${outputFolder + '/720'}/${timestamp}_720.m3u8`)
                           .on('end', () => {
                              callback(`${timestamp}_720.m3u8`, outputFolder + '/720', '720p');
                              resolve();
                           })
                           .on('error', (error) => {
                              console.log(error);
                              resolve();
                           })
                           .run();
                     });
                  });
            })
            .then(() => {
               var tempPic = 300;

               if (durationOfVideo / 300 > 1)
                  tempPic = tempPic + ((durationOfVideo - 300) / 60) * 8;
               else if (durationOfVideo < 60) {
                  tempPic = durationOfVideo * 2;
               } else if (durationOfVideo < 300) tempPic = durationOfVideo;

               fs.mkdirSync(outputFolder + '/image', { recursive: true });

               const stepTime = tempPic / durationOfVideo;

               return new Promise((resolve, reject) => {
                  ffmpeg(videoPath)
                     .on('progress', (progress) => {
                        res.write(
                           JSON.stringify({
                              curStep: 3,
                              percent: +timemarkToSeconds(progress.timemark) / +durationOfVideo,
                              maxStep: 3,
                           }),
                        );
                        res.flushHeaders();
                     })
                     .outputOptions([
                        '-vf fps=10', // image/s
                        `-r ${tempPic}/${durationOfVideo}`,
                        '-q:v 169', // image quality 0 -> 255 (0 is best)
                        '-vf scale=w=208:h=117:force_original_aspect_ratio=decrease',
                     ])
                     .output(`${outputFolder}/image/image_%05d.jpg`)
                     .on('end', () => {
                        console.log('Trích xuất hình ảnh thành công');

                        resolve(stepTime);
                     })
                     .on('error', (err) => {
                        console.error('Lỗi trong quá trình trích xuất hình ảnh:', err);
                        resolve(stepTime);
                     })
                     .run();
               });
            })
            .then((resultTime) => {
               fs.readdir(`${outputFolder}/image/`, async (err, files) => {
                  if (err) {
                     console.error('Lỗi khi đọc thư mục:', err);
                     return;
                  }

                  const countFile = files.length;

                  const promises = [];

                  for (let i = 0; i < countFile; i++) {
                     const filePath = `${outputFolder}/image/image_${('00000' + (i + 1)).slice(
                        -5,
                     )}.jpg`;

                     promises.push(
                        new Promise((resolve, reject) => {
                           fs.readFile(filePath, 'base64', async (err, data) => {
                              if (err) {
                                 console.error('Error reading image file:', err);
                                 reject(err);
                              } else {
                                 try {
                                    await saveThumbnail(
                                       videoIDGlobal,
                                       i * +resultTime,
                                       new Buffer.from(data, 'base64').toString('base64'),
                                    );
                                    resolve();
                                 } catch (error) {
                                    reject(error);
                                 }
                              }
                           });
                        }),
                     );
                  }

                  return Promise.all(promises)
                     .then(() => {
                        fs.rmSync(outputFolder, { recursive: true, force: true });
                        return { success: true };
                     })
                     .catch((error) => {
                        console.error('Error saving thumbnails:', error);
                     });
               });
            })
            .then(() => {
               ProductDetailService.update({ video_ref: tempVideoRef }, videoIDGlobal).then(
                  (res) => {
                     console.log(res);
                  },
               );
            });
      } catch (error) {}
   }

   async streaming_video(videoId, res) {
      try {
         const videoInfo = await VideoInfo.findById(videoId);
         if (!videoInfo) {
            return res.status(404).json({ success: false, message: 'Video not found' });
         }

         res.set('Content-Type', 'application/vnd.apple.mpegurl');

         const stream = new PassThrough();
         stream.end(videoInfo.videoData);

         stream.pipe(res);
      } catch (err) {
         console.log(err);
      }
   }

   async get_thumbnail_of_video(videoId) {
      try {
         const thumbnails = await Thumbnail.find({ videoId });

         return { success: true, thumbnails };
      } catch (err) {
         console.log(err);
         return { success: false, thumbnails: null };
      }
   }
}

export default new VideoServices();
