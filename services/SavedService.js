import pkg from 'mongoose';

import Saveds from '../app/models/SavedModel.js';

class SavedService {
   async getOf({ user_id = null }) {
      const filter = {
         user_id: pkg.Types.ObjectId(user_id),
      };

      try {
         const saveds = await Saveds.find(filter);
         return { success: true, saveds: saveds };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async checkSaved(obj = { user_id: '', ref_id: '' }) {
      if (!obj.user_id || obj.user_id === '')
         return { success: false, message: 'user_id is required' };
      if (!obj.ref_id || obj.ref_id === '')
         return { success: false, message: 'ref_id is required' };

      const filter = { user_id: obj.user_id, ref_id: obj.ref_id };

      try {
         const saveds = await Saveds.find(filter);
         return { success: true, isSaved: saveds.length > 0 };
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
         const newSaved = new Saveds(obj);

         await newSaved.save();

         return { success: true, saved: newSaved };
      } catch (error) {
         return { success: false, message: 'Add saved failed!' };
      }
   }

   async delete(obj = { user_id: '', ref_id: '' }) {
      if (!obj.user_id || obj.user_id === '')
         return { success: false, message: 'user_id is required' };
      if (!obj.ref_id || obj.ref_id === '')
         return { success: false, message: 'ref_id is required' };

      try {
         const filter = { user_id: obj.user_id, ref_id: obj.ref_id };

         const deletedSaved = await Saveds.findOneAndDelete(filter);

         if (!deletedSaved)
            return {
               success: false,
               message: 'Saved not found or user not authoirised (savedController: Row - 78)',
            };

         return {
            success: true,
            saved: deletedSaved,
         };
      } catch (error) {
         return {
            success: false,
            message: 'Get saved failed! (savedController: Row - 91)',
         };
      }
   }
}

export default new SavedService();
