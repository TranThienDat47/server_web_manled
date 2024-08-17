import CommentService from '../../services/CommentService.js';
import { HttpMessage, HttpStatus } from '../../global/enumGlobal.js';

class CommentsController {
   async getCountCommentOfRoot(req, res) {
      const { parent_id } = req.params;

      CommentService.getCountCommentOfProduct(parent_id)
         .then((result) => {
            const { success, count } = result;

            if (!success) {
               return res.status(HttpStatus.UNAUTHORIZED).json({
                  success: false,
                  message: HttpMessage.UNAUTHORIZED,
               });
            }

            return res.json({ success: true, count });
         })
         .catch((err) => {
            return res.status(HttpStatus.UNAUTHORIZED).json({
               success: false,
               message: HttpMessage.UNAUTHORIZED,
            });
         });
   }

   async get(req, res) {
      const { parent_id, skip, limit, sort } = req.query;

      CommentService.getOption(parent_id, skip, limit, sort)
         .then((result) => {
            const { success, comments } = result;

            if (!success) {
               return res.status(HttpStatus.UNAUTHORIZED).json({
                  success: false,
                  message: HttpMessage.UNAUTHORIZED,
               });
            }

            return res.json({ success: true, comments });
         })
         .catch((err) => {
            return res.status(HttpStatus.UNAUTHORIZED).json({
               success: false,
               message: HttpMessage.UNAUTHORIZED,
            });
         });
   }

   async add(req, res) {
      const { user_id, content, parent_id, reply_with, isReply = false } = req.body;

      if (!parent_id || !user_id || !content) {
         return res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: HttpMessage.BAD_REQUEST,
         });
      } else {
         CommentService.add({ user_id, parent_id, content, reply_with }, isReply)
            .then((result) => {
               const { success, comment, message } = result;

               if (!success) {
                  return res.status(HttpStatus.UNAUTHORIZED).json({
                     success: false,
                     message: message,
                  });
               }
               res.json({
                  success: true,
                  comments: comment,
               });
            })
            .catch((err) => {
               return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                  success: false,
                  message: HttpMessage.INTERNAL_SERVER_ERROR,
               });
            });
      }
   }

   async update(req, res) {
      const { new_content, comment_id } = req.body;

      if (!comment_id || !new_content) {
         return res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: HttpMessage.BAD_REQUEST,
         });
      } else {
         CommentService.update(comment_id, new_content)
            .then((result) => {
               const { success, comment, message } = result;

               if (!success) {
                  return res.status(HttpStatus.UNAUTHORIZED).json({
                     success: false,
                     message: message,
                  });
               }

               res.json({
                  success: true,
                  comments: comment,
               });
            })
            .catch((err) => {
               return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                  success: false,
                  message: HttpMessage.INTERNAL_SERVER_ERROR,
               });
            });
      }
   }

   async likeComment(req, res) {
      const { comment_id, user_id } = req.body;

      if (!comment_id || !user_id) {
         return res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: HttpMessage.BAD_REQUEST,
         });
      } else {
         await CommentService.likeComment({ comment_id, user_id })
            .then((result) => {
               const { success, likeComment, message } = result;

               if (!success) {
                  return res.status(HttpStatus.UNAUTHORIZED).json({
                     success: false,
                     message: message,
                  });
               }

               res.json({
                  success: true,
                  likeComment: likeComment,
               });
            })
            .catch((err) => {
               return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                  success: false,
                  message: HttpMessage.INTERNAL_SERVER_ERROR,
               });
            });
      }
   }

   async disLikeComment(req, res) {
      const { comment_id, user_id } = req.body;

      if (!comment_id || !user_id) {
         return res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: HttpMessage.BAD_REQUEST,
         });
      } else {
         await CommentService.disLikeComment({ comment_id, user_id })
            .then((result) => {
               const { success, likeComment, message } = result;

               if (!success) {
                  return res.status(HttpStatus.UNAUTHORIZED).json({
                     success: false,
                     message: message,
                  });
               }

               res.json({
                  success: true,
                  likeComment: likeComment,
               });
            })
            .catch((err) => {
               return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                  success: false,
                  message: HttpMessage.INTERNAL_SERVER_ERROR,
               });
            });
      }
   }

   async checkUserLikeComment(req, res) {
      const { comment_id, user_id } = req.body;

      if (!comment_id) {
         res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: HttpMessage.BAD_REQUEST,
         });
      } else {
         await CommentService.checkUserLikeComment({ comment_id, user_id })
            .then((result) => {
               const { success, message, likeComment } = result;
               if (!success) {
                  return res.status(HttpStatus.UNAUTHORIZED).json({
                     success: false,
                     message: message,
                     likeComment: null,
                  });
               }

               res.json({
                  success: true,
                  likeComment: likeComment,
               });
            })
            .catch(() => {
               return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                  success: false,
                  message: HttpMessage.INTERNAL_SERVER_ERROR,
                  likeComment: null,
               });
            });
      }
   }

   async getNumLikeComment(req, res) {
      const { comment_detail_id } = req.body;

      if (!comment_detail_id) {
         res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: HttpMessage.BAD_REQUEST,
         });
      } else {
         await CommentService.getNumLikesComments({ comment_detail_id })
            .then((result) => {
               const { success, message, num_like_comments } = result;
               if (!success) {
                  return res.status(HttpStatus.UNAUTHORIZED).json({
                     success: false,
                     message: message,
                     num_like_comments: null,
                  });
               }

               res.json({
                  success: true,
                  num_like_comments: num_like_comments,
               });
            })
            .catch(() => {
               return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                  success: false,
                  message: HttpMessage.INTERNAL_SERVER_ERROR,
                  num_like_comments: null,
               });
            });
      }
   }
}

export default new CommentsController();
