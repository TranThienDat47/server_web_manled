import pkg from 'mongoose';

import Follows from '../app/models/FollowModel.js';

class CategoryServices {
   // async getAll(_id) {
   //    const filter = {
   //       $or: [{ _id: pkg.Types.ObjectId(_id) }, { parentID: pkg.Types.ObjectId(_id) }],
   //    };

   //    try {
   //       const categories = await Categories.find(filter);
   //       return { success: true, categories };
   //    } catch (error) {
   //       return { success: false, message: error.message };
   //    }
   // }

   async add(obj = { userID: '', refID: '' }) {
      if (!obj.userID || obj.userID === '')
         return { success: false, message: 'userID is required' };
      if (!obj.refID || obj.refID.length <= 0)
         return { success: false, message: 'refID is required' };

      try {
         const newFollow = new Follows(obj);

         await newFollow.save();

         return { success: true, categories: newFollow };
      } catch (error) {
         return { success: false, message: 'Registration failed!' };
      }
   }

   async delete(_id) {
      try {
         const filter = { _id: pkg.Types.ObjectId(_id) };

         const deletedcategory = await Categories.findOneAndDelete(filter);

         if (!deletedcategory)
            return {
               success: false,
               message:
                  'categories not found or user not authoirised (categoriesController: Row - 78)',
            };

         return {
            success: true,
            categories: deletedcategory,
         };
      } catch (error) {
         return {
            success: false,
            message: 'Get categories failed! (categoriesController: Row - 91)',
         };
      }
   }
}

export default new CategoryServices();
