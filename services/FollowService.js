import pkg from 'mongoose';

import Follows from '../app/models/FollowModel.js';

class FollowServices {
   async getOf({ user_id = null }) {
      console.log(user_id);
      const filter = {
         user_id: pkg.Types.ObjectId(user_id),
      };

      try {
         const follows = await Follows.find(filter);
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
         return { success: false, message: 'user_id is required' };
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
