import VideoServices from '../../services/VideoServices.js';

class VideoController {
   async converMp4ToM3u8(req, res) {
      const videoPath = req.file.path;
      const videoName = req.body.file_name;
      const productId = req.body.product_id;

      return await VideoServices.convert_to_m3u8(videoPath, videoName, productId, res).then(() => {
         res.end(JSON.stringify({ success: true }));
      });
   }

   stream_video(req, res) {
      const videoId = req.params.video_id;

      return VideoServices.streaming_video(videoId, res);
   }

   async get_thumbnail(req, res) {
      const videoId = req.params.id;

      const result = await VideoServices.get_thumbnail_of_video(videoId);

      return res.json(result);
   }
}

export default new VideoController();
