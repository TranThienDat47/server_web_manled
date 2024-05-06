import pkg from 'mongoose';

import Follows from '../app/models/FollowModel.js';
import { standardized } from '../helpers/utils.js';

class FollowServices {
   async getOf({
      user_id = null,
      skip = 0,
      limit = Number.MAX_SAFE_INTEGER,
      keySearch = '',
      sort = 1,
   }) {
      const options = { skip, limit };

      var _key = '',
         _key_more = '';

      if (keySearch) {
         _key = new RegExp(keySearch);
         _key_more = new RegExp(standardized(keySearch));
      }

      if (options.limit === 'null' || !+options.limit || +options.limit === -1) {
         options.limit = Number.MAX_SAFE_INTEGER;
      }

      try {
         const follows = await Follows.aggregate([
            { $match: { user_id: pkg.Types.ObjectId(user_id) } },
            {
               $lookup: {
                  from: 'products',
                  let: { ref_id: '$ref_id' },
                  pipeline: [
                     {
                        $match: {
                           $expr: {
                              $and: [
                                 { $eq: ['$_id', '$$ref_id'] },
                                 {
                                    $regexMatch: {
                                       input: '$keySearch',
                                       regex: _key_more,
                                       options: 'i',
                                    },
                                 },
                              ],
                           },
                        },
                     },
                  ],
                  as: 'product',
               },
            },
            { $unwind: '$product' },
            {
               $project: {
                  _id: '$product._id',
                  ref_id: 1,
                  user_id: 1,
                  img: '$product.img',
                  _name: '$product._name',
                  anotherName: '$product.anotherName',
                  view: '$product.view',
                  episodes: '$product.episodes',
                  createdAt: '$product.createdAt',
               },
            },
            { $sort: { createdAt: parseInt(sort) } },
            { $skip: +options.skip },
            { $limit: +options?.limit },
         ]);
         return { success: true, follows };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async checkFollow(obj = { user_id: '', ref_id: '' }) {
      if (!obj.user_id || obj.user_id === '')
         return { success: false, message: 'user_id is required' };
      if (!obj.ref_id || obj.ref_id === '')
         return { success: false, message: 'ref_id is required' };

      const filter = { user_id: obj.user_id, ref_id: obj.ref_id };

      try {
         const follows = await Follows.find(filter);
         return { success: true, isFollow: follows.length > 0 };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async add(obj = { user_id: '', ref_id: '' }) {
      if (!obj.user_id || obj.user_id === '')
         return { success: false, message: 'user_id is required' };
      if (!obj.ref_id || obj.ref_id === '')
         return { success: false, message: 'ref_id is required' };

      try {
         const newFollow = new Follows(obj);

         await newFollow.save();

         return { success: true, follows: newFollow };
      } catch (error) {
         return { success: false, message: 'Add follow failed!' };
      }
   }

   async delete(obj = { user_id: '', ref_id: '' }) {
      if (!obj.user_id || obj.user_id === '')
         return { success: false, message: 'user_id is required' + obj.user_id };
      if (!obj.ref_id || obj.ref_id === '')
         return { success: false, message: 'ref_id is required' };

      try {
         const filter = { user_id: obj.user_id, ref_id: obj.ref_id };

         const deletedFollow = await Follows.findOneAndDelete(filter);

         if (!deletedFollow)
            return {
               success: false,
               message: 'follows not found or user not authoirised (followsController: Row - 78)',
            };

         return {
            success: true,
            follows: deletedFollow,
         };
      } catch (error) {
         return {
            success: false,
            message: 'Get follows failed! (followsController: Row - 91)',
         };
      }
   }
}

export default new FollowServices();
