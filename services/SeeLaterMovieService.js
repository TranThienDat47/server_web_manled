import pkg from 'mongoose';

import SeeLaterMovies from '../app/models/SeeLaterMovieModel.js';
import { standardized } from '../helpers/utils.js';

class SeeLaterMovieServices {
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
         const seeLaterMovies = await SeeLaterMovies.aggregate([
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
         return { success: true, seeLaterMovies };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async checkSeeLaterMovie(obj = { user_id: '', ref_id: '' }) {
      if (!obj.user_id || obj.user_id === '')
         return { success: false, message: 'user_id is required' };
      if (!obj.ref_id || obj.ref_id === '')
         return { success: false, message: 'ref_id is required' };

      const filter = { user_id: obj.user_id, ref_id: obj.ref_id };

      try {
         const seeLaterMovies = await SeeLaterMovies.find(filter);
         return { success: true, isSeeLaterMovie: seeLaterMovies.length > 0 };
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
         const newSeeLaterMovie = new SeeLaterMovies(obj);

         await newSeeLaterMovie.save();

         return { success: true, seeLaterMovies: newSeeLaterMovie };
      } catch (error) {
         return { success: false, message: 'Add seeLaterMovie failed!' };
      }
   }

   async delete(obj = { user_id: '', ref_id: '' }) {
      if (!obj.user_id || obj.user_id === '')
         return { success: false, message: 'user_id is required' + obj.user_id };
      if (!obj.ref_id || obj.ref_id === '')
         return { success: false, message: 'ref_id is required' };

      try {
         const filter = { user_id: obj.user_id, ref_id: obj.ref_id };

         const deletedSeeLaterMovie = await SeeLaterMovies.findOneAndDelete(filter);

         if (!deletedSeeLaterMovie)
            return {
               success: false,
               message:
                  'seeLaterMovies not found or user not authoirised (seeLaterMoviesController: Row - 78)',
            };

         return {
            success: true,
            seeLaterMovies: deletedSeeLaterMovie,
         };
      } catch (error) {
         return {
            success: false,
            message: 'Get seeLaterMovies failed! (seeLaterMoviesController: Row - 91)',
         };
      }
   }
}

export default new SeeLaterMovieServices();
