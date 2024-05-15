import pkg from 'mongoose';

import Comments from '../app/models/Comments.js';
import CommentDetail from '../app/models/CommentDetail.js';
import LikeComments from '../app/models/LikeComments.js';

const { sanitizeFilter } = pkg;

class CommentService {
   async getCountCommentOfProduct(parent_id) {
      try {
         const objectId = pkg.Types.ObjectId(parent_id);

         const result = await Comments.aggregate([
            { $match: { parent_id: objectId } },
            {
               $project: {
                  totalReplies: { $sum: '$comment_details.replies' },
                  counts: 1,
               },
            },
            {
               $group: {
                  _id: null,
                  totalComments: { $sum: '$counts' },
                  totalReplies: { $sum: '$totalReplies' },
               },
            },
            {
               $project: {
                  total: {
                     $add: ['$totalComments', '$totalReplies'],
                  },
               },
            },
         ]);

         const count = result.length > 0 ? result[0].total : 0;

         return { success: true, count };
      } catch (error) {
         return { success: false, count: 0, error: error.message };
      }
   }

   async get(parent_id) {
      try {
         const comments = await Comments.aggregate([
            { $match: { parent_id: pkg.Types.ObjectId(parent_id) } },
            {
               $unwind: '$comment_details',
            },
            {
               $lookup: {
                  from: 'users',
                  localField: 'comment_details.user_id',
                  foreignField: '_id',
                  as: 'user',
               },
            },
            {
               $unwind: '$user',
            },
            {
               $project: {
                  _id: 1,
                  comment_details: {
                     _id: 1,
                     user_id: 1,
                     content: 1,
                     likes: 1,
                     replies: 1,
                     createdAt: 1,
                     updatedAt: 1,
                     reply_with: 1,
                     _name: '$user._name',
                     img: '$user.img',
                  },
               },
            },
         ]);

         return { success: true, comments };
      } catch (error) {
         return { success: false, comments: null, error: error.message };
      }
   }

   async getOption(parent_id, skip = null, limit = null, sort = -1) {
      try {
         if (skip !== 'null' && skip !== null && limit !== 'null' && limit !== null) {
            const comments = await Comments.aggregate([
               { $match: { parent_id: pkg.Types.ObjectId(parent_id) } },
               { $skip: +skip },
               { $limit: +limit },
               {
                  $unwind: '$comment_details',
               },
               {
                  $lookup: {
                     from: 'users',
                     localField: 'comment_details.user_id',
                     foreignField: '_id',
                     as: 'user',
                  },
               },
               {
                  $unwind: '$user',
               },
               {
                  $project: {
                     _id: 1,
                     comment_details: {
                        _id: 1,
                        user_id: 1,
                        content: 1,
                        likes: 1,
                        replies: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        reply_with: 1,
                        _name: '$user._name',
                        img: '$user.img',
                     },
                  },
               },
               { $sort: { createdAt: parseInt(sort) } },
            ]);

            return { success: true, comments };
         }

         if (skip !== 'null' && skip !== null) {
            const comments = await Comments.aggregate([
               { $match: { parent_id: pkg.Types.ObjectId(parent_id) } },
               { $skip: +skip },
               {
                  $unwind: '$comment_details',
               },
               {
                  $lookup: {
                     from: 'users',
                     localField: 'comment_details.user_id',
                     foreignField: '_id',
                     as: 'user',
                  },
               },
               {
                  $unwind: '$user',
               },
               {
                  $project: {
                     _id: 1,
                     comment_details: {
                        _id: 1,
                        user_id: 1,
                        content: 1,
                        likes: 1,
                        replies: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        reply_with: 1,
                        _name: '$user._name',
                        img: '$user.img',
                     },
                  },
               },
               { $sort: { createdAt: parseInt(sort) } },
            ]);

            return { success: true, comments };
         }

         if (limit !== 'null' && limit !== null) {
            const comments = await Comments.aggregate([
               { $match: { parent_id: pkg.Types.ObjectId(parent_id) } },
               { $limit: +limit },
               {
                  $unwind: '$comment_details',
               },
               {
                  $lookup: {
                     from: 'users',
                     localField: 'comment_details.user_id',
                     foreignField: '_id',
                     as: 'user',
                  },
               },
               {
                  $unwind: '$user',
               },
               {
                  $project: {
                     _id: 1,
                     comment_details: {
                        _id: 1,
                        user_id: 1,
                        content: 1,
                        likes: 1,
                        replies: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        reply_with: 1,
                        _name: '$user._name',
                        img: '$user.img',
                     },
                  },
               },
               { $sort: { createdAt: parseInt(sort) } },
            ]);

            return { success: true, comments };
         }

         const comments = await Comments.aggregate([
            { $match: { parent_id: pkg.Types.ObjectId(parent_id) } },
            {
               $unwind: '$comment_details',
            },
            {
               $lookup: {
                  from: 'users',
                  localField: 'comment_details.user_id',
                  foreignField: '_id',
                  as: 'user',
               },
            },
            {
               $unwind: '$user',
            },
            {
               $project: {
                  _id: 1,
                  comment_details: {
                     _id: 1,
                     user_id: 1,
                     content: 1,
                     likes: 1,
                     replies: 1,
                     createdAt: 1,
                     updatedAt: 1,
                     reply_with: 1,
                     _name: '$user._name',
                     img: '$user.img',
                  },
               },
            },
            { $sort: { 'comment_details.createdAt': parseInt(sort) } },
         ]);

         return { success: true, comments };
      } catch (error) {
         return { success: true, message: error.message };
      }
   }

   async add(
      data = { user_id, parent_id, content, likes: 0, replies: 0, reply_with: {} },
      isReply = false,
   ) {
      const commentDetail = CommentDetail(sanitizeFilter(data));

      try {
         const filter = {
            parent_id: sanitizeFilter(data.parent_id),
            counts: { $lt: Number(10) },
         };

         const updateDoc = {
            $inc: { counts: 1 },
            $push: { comment_details: commentDetail },
            $setOnInsert: {
               parent_id: data.parent_id,
            },
         };

         const options = {
            new: true,
            upsert: true,
         };

         const addComments = await Comments.findOneAndUpdate(filter, updateDoc, options);

         if (!addComments)
            return {
               success: false,
               comment: null,
               message: 'Comments not found or user not authoirised1',
            };

         if (isReply) this.addReplyCount(data.parent_id, 1);

         return { success: true, comment: addComments, message: '' };
      } catch (error) {
         console.log(error);
         return {
            success: false,
            comment: null,
            message: 'Comments not found or user not authoirised',
         };
      }
   }

   async update(comment_id, new_content) {
      try {
         const filter = {
            comment_details: { $elemMatch: { _id: pkg.Types.ObjectId(comment_id) } },
         };

         const updateDoc = {
            $set: { 'comment_details.$[elem].content': new_content },
         };

         const options = {
            strict: false,
            arrayFilters: [{ 'elem._id': pkg.Types.ObjectId(comment_id) }],
         };

         const updatedComments = await Comments.updateOne(filter, updateDoc, options);

         if (!updatedComments)
            return {
               success: false,
               comments: null,
               message: 'Comments not found or user not authoirised',
            };

         return {
            success: true,
            comments: updatedComments,
            message: '',
         };
      } catch (error) {
         return {
            success: false,
            comments: null,
            message: error.message.message,
         };
      }
   }

   async addReplyCount(comment_id, counts) {
      try {
         const filter = {
            comment_details: { $elemMatch: { _id: pkg.Types.ObjectId(comment_id) } },
         };

         const updateDoc = {
            $inc: { 'comment_details.$[elem].replies': counts },
         };

         const options = {
            strict: false,
            arrayFilters: [{ 'elem._id': pkg.Types.ObjectId(comment_id) }],
         };

         const updatedComments = await Comments.updateOne(filter, updateDoc, options);

         if (!updatedComments)
            return {
               success: false,
               comments: null,
               message: 'Comments not found or user not authoirised',
            };

         return {
            success: true,
            comments: updatedComments,
            message: '',
         };
      } catch (error) {
         return {
            success: false,
            comments: null,
            message: error.message.message,
         };
      }
   }

   async addLikeComment(comment_id, counts) {
      try {
         const filter = {
            comment_details: { $elemMatch: { _id: pkg.Types.ObjectId(comment_id) } },
         };

         const updateDoc = {
            $inc: { 'comment_details.$[elem].likes': counts },
         };

         const options = {
            strict: false,
            arrayFilters: [{ 'elem._id': pkg.Types.ObjectId(comment_id) }],
         };

         const updatedComments = await Comments.updateOne(filter, updateDoc, options);

         if (!updatedComments)
            return {
               success: false,
               comments: null,
               message: 'Comments not found or user not authoirised',
            };

         return {
            success: true,
            comments: updatedComments,
         };
      } catch (error) {
         return {
            success: false,
            comments: null,
            message: error.message,
         };
      }
   }

   async getNumLikesComments({ comment_detail_id }) {
      try {
         const filter = {
            comment_details: { $elemMatch: { _id: pkg.Types.ObjectId(comment_detail_id) } },
         };

         const options = {
            arrayFilters: [{ 'elem._id': pkg.Types.ObjectId(comment_detail_id) }],
            projection: { 'comment_details.$': 1 },
         };

         const getLikeComments = await Comments.findOne(filter, {}, options);

         console.log(getLikeComments.comment_details[0].likes);

         if (!getLikeComments)
            return {
               success: false,
               num_like_comments: null,
               message: 'Comments not found or user not authoirised',
            };

         return {
            success: true,
            num_like_comments: getLikeComments.comment_details[0].likes,
            message: '',
         };
      } catch (error) {
         return {
            success: false,
            num_like_comments: null,
            message: error.message.message,
         };
      }
   }

   async checkUserLikeComment({ comment_id, user_id }) {
      try {
         const filter = {
            comment_id: pkg.Types.ObjectId(comment_id),
            user_id: pkg.Types.ObjectId(user_id),
         };

         const checkComment = await LikeComments.findOne(filter);

         if (!checkComment)
            return {
               success: true,
               likeComment: null,
               message: "can't find comment",
            };

         return {
            success: true,
            likeComment: checkComment,
            message: 'user have liked comment',
         };
      } catch (error) {
         return {
            success: false,
            likeComment: null,
            message: error.message,
         };
      }
   }

   async likeComment({ comment_id, user_id }) {
      try {
         const checkUser = await this.checkUserLikeComment({ comment_id, user_id });

         if (checkUser.success && !checkUser.likeComment) {
            const newLikeComment = await LikeComments.findOneAndUpdate(
               { comment_id, user_id },
               { $set: { comment_id, user_id } },
               { upsert: true, new: true },
            );

            await this.addLikeComment(comment_id, 1);

            return {
               success: true,
               likeComment: newLikeComment,
               message: 'Successfully added',
            };
         } else {
            return {
               success: false,
               likeComment: null,
               message: 'Users liked comment',
            };
         }
      } catch (error) {
         return {
            success: false,
            likeComment: null,
            message: error.message,
         };
      }
   }

   async disLikeComment({ comment_id, user_id }) {
      try {
         const checkUser = await this.checkUserLikeComment({ comment_id, user_id });

         if (checkUser.success && checkUser.likeComment) {
            const filter = {
               comment_id: pkg.Types.ObjectId(comment_id),
               user_id: pkg.Types.ObjectId(user_id),
            };

            const disLikeComment = await LikeComments.findOneAndDelete(filter);

            if (!disLikeComment)
               return {
                  success: false,
                  likeComment: null,
                  message: "can't find comment",
               };

            await this.addLikeComment(comment_id, -1);

            return {
               success: true,
               likeComment: disLikeComment,
               message: 'dislike comment successfully',
            };
         } else {
            return {
               success: false,
               likeComment: null,
               message: 'users not liked comment',
            };
         }
      } catch (error) {
         return {
            success: false,
            likeComment: null,
            message: error.message,
         };
      }
   }
}

export default new CommentService();
