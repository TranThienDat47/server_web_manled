import CommentService from '../../services/CommentService.js';

class CommentsController {
   async get(req, res) {
      const { parent_id, skip, limit, sort } = req.query;

      CommentService.getOption(parent_id, skip, limit, sort)
         .then((result) => {
            const { success, comments } = result;

            if (!success)
               return res.status(401).json({
                  success: false,
                  message: 'Get comments failed!',
               });

            return res.json({ success: true, comments });
         })
         .catch((err) => {
            return res.status(401).json({
               success: false,
               message: 'Get comments failed!',
            });
         });
   }

   async add(req, res) {
      const { user_id, content, parent_id, isReply = false } = req.body;

      if (!parent_id || !user_id || !content)
         return res.status(400).json({ success: false, message: 'Comments is required' });
      else {
         CommentService.add({ user_id, parent_id, content }, isReply)
            .then((result) => {
               const { success, comment, message } = result;

               if (!success)
                  return res.status(401).json({
                     success: false,
                     message: message,
                  });
               res.json({
                  success: true,
                  comments: comment,
               });
            })
            .catch((err) => {
               return res.status(500).json({ success: false, message: 'Add comments failed!' });
            });
      }
   }

   async update(req, res) {
      const { new_content, comment_id } = req.body;

      if (!comment_id || !new_content)
         return res.status(400).json({ success: false, message: 'Comments is required' });
      else {
         CommentService.update(comment_id, new_content)
            .then((result) => {
               const { success, comment, message } = result;

               if (!success)
                  return res.status(401).json({
                     success: false,
                     message: message,
                  });

               res.json({
                  success: true,
                  comments: comment,
               });
            })
            .catch((err) => {
               return res
                  .status(500)
                  .json({ success: false, message: 'Updated comments failed!1' });
            });
      }
   }

   async likeComment(req, res) {
      const { comment_id, user_id } = req.body;

      if (!comment_id || !user_id)
         return res.status(400).json({ success: false, message: 'Comments is required' });
      else {
         await CommentService.likeComment({ comment_id, user_id })
            .then((result) => {
               const { success, likeComment, message } = result;

               if (!success)
                  return res.status(401).json({
                     success: false,
                     message: message,
                  });

               res.json({
                  success: true,
                  likeComment: likeComment,
               });
            })
            .catch((err) => {
               return res
                  .status(500)
                  .json({ success: false, message: 'Updated comments failed!1' });
            });
      }
   }
   async disLikeComment(req, res) {
      const { comment_id, user_id } = req.body;

      if (!comment_id || !user_id)
         return res.status(400).json({ success: false, message: 'Comments is required' });
      else {
         await CommentService.disLikeComment({ comment_id, user_id })
            .then((result) => {
               const { success, likeComment, message } = result;

               if (!success)
                  return res.status(401).json({
                     success: false,
                     message: message,
                  });

               res.json({
                  success: true,
                  likeComment: likeComment,
               });
            })
            .catch((err) => {
               return res
                  .status(500)
                  .json({ success: false, message: 'Updated comments failed!1' });
            });
      }
   }

   async checkUserLikeComment(req, res) {
      const { comment_id, user_id } = req.body;

      if (!comment_id) {
         res.status(400).json({ success: false, message: 'comments id requiredc' });
      } else {
         await CommentService.checkUserLikeComment({ comment_id, user_id })
            .then((result) => {
               const { success, message, likeComment } = result;
               if (!success)
                  return res.status(401).json({
                     success: false,
                     message: message,
                     likeComment: null,
                  });

               res.json({
                  success: true,
                  likeComment: likeComment,
               });
            })
            .catch(() => {
               return res.status(500).json({
                  success: false,
                  message: 'check users liked comments failed!1',
                  likeComment: null,
               });
            });
      }
   }

   async getNumLikeComment(req, res) {
      const { comment_detail_id } = req.body;

      if (!comment_detail_id) {
         res.status(400).json({ success: false, message: 'comments id required' });
      } else {
         await CommentService.getNumLikesComments({ comment_detail_id })
            .then((result) => {
               const { success, message, num_like_comments } = result;
               if (!success)
                  return res.status(401).json({
                     success: false,
                     message: message,
                     num_like_comments: null,
                  });

               res.json({
                  success: true,
                  num_like_comments: num_like_comments,
               });
            })
            .catch(() => {
               return res.status(500).json({
                  success: false,
                  message: 'check users liked comments failed!1',
                  num_like_comments: null,
               });
            });
      }
   }
}

export default new CommentsController();
