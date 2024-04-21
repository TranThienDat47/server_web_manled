import pkg from 'mongoose';

import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import fs from 'fs';
import path from 'path';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

var filename = './services/3120560019_TranThienDat.mp4';

function callback() {
   // do something when encoding is done
   fs.writeFile(
      'videos/index.m3u8',
      '#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360\n360p.m3u8\n#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=842x480\n480p.m3u8\n#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720\n720p.m3u8',
      function (err) {
         if (err) {
            return console.log(err);
         }
         console.log('The file was saved!');
      },
   );
}

class VideoServices {
   convert_to_m3u8(videoPath = '') {
      return new Promise((resolve, rejects) => {
         try {
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
                  '-hls_segment_filename ./ts/360p_%03d.ts',
                  '-hls_playlist_type vod',
                  '-f hls',
               ])
               .output('./videos/360p.m3u8')
               .on('error', function (err, stdout, stderr) {
                  if (err) {
                     console.log(err.message);
                     console.log('stdout:\n' + stdout);
                     console.log('stderr:\n' + stderr);
                     rejects('Error');
                  }
               })
               .on('end', callback)
               .run();

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
                  '-hls_segment_filename ./videos/480p_%03d.ts',
                  '-hls_playlist_type vod',
                  '-f hls',
               ])
               .output('./videos/480p.m3u8')
               .run();

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
                  '-hls_segment_filename ./videos/720p_%03d.ts',
                  '-hls_playlist_type vod',
                  '-f hls',
               ])
               .output('./videos/720p.m3u8')
               .on('end', callback)
               .run();

            resolve({ message: true });
         } catch (error) {
            rejects(error);
         }
      });
   }

   streaming_video() {}
}

export default new VideoServices();
