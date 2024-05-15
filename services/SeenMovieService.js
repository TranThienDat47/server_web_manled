import pkg from 'mongoose';

import { standardized } from '../helpers/utils.js';
import SeenMovieModel from '../app/models/SeenMovieModel.js';

class SeenMovieService {
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
         const seenMovies = await SeenMovieModel.aggregate([
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
                  updatedAt: '$product.updatedAt',
               },
            },
            { $sort: { updatedAt: parseInt(sort) } },
            { $skip: +options.skip },
            { $limit: +options?.limit },
         ]);
         return { success: true, seenMovies };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async checkSeenMovie(obj = { user_id: '', ref_id: '' }) {
      if (!obj.user_id || obj.user_id === '')
         return { success: false, message: 'user_id is required' };
      if (!obj.ref_id || obj.ref_id === '')
         return { success: false, message: 'ref_id is required' };

      const filter = { user_id: obj.user_id, ref_id: obj.ref_id };

      try {
         const seenMovies = await SeenMovieModel.find(filter);
         return { success: true, isSeenMovie: seenMovies.length > 0 };
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
         let seenMovie = await SeenMovieModel.findOneAndUpdate(
            { user_id: obj.user_id, ref_id: obj.ref_id },
            { ...obj, updatedAt: Date.now() },
            { upsert: true, new: true },
         );

         return { success: true, seenMovies: seenMovie };
      } catch (error) {
         return { success: false, message: 'Add seenMovie failed! ' + error.message };
      }
   }

   async delete(obj = { user_id: '', ref_id: '' }) {
      if (!obj.user_id || obj.user_id === '')
         return { success: false, message: 'user_id is required' + obj.user_id };
      if (!obj.ref_id || obj.ref_id === '')
         return { success: false, message: 'ref_id is required' };

      try {
         const filter = { user_id: obj.user_id, ref_id: obj.ref_id };

         const deletedSeenMovie = await SeenMovieModel.findOneAndDelete(filter);

         if (!deletedSeenMovie)
            return {
               success: false,
               message:
                  'seenMovies not found or user not authoirised (seenMoviesController: Row - 78)',
            };

         return {
            success: true,
            seenMovies: deletedSeenMovie,
         };
      } catch (error) {
         return {
            success: false,
            message: 'Get seenMovies failed! (seenMoviesController: Row - 91)',
         };
      }
   }
}

export default new SeenMovieService();
