import pkg from 'mongoose';

import Categories from '../app/models/Categories.js';

class CategoryServices {
   async getOf(_id) {
      const filter = {
         $or: [{ _id: pkg.Types.ObjectId(_id) }, { parentID: pkg.Types.ObjectId(_id) }],
      };

      try {
         const categories = await Categories.find(filter);
         return { success: true, categories };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async getAll(_id) {
      const filter = { parentID: null };

      try {
         const categories = await Categories.find(filter);
         return { success: true, categories };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async add(obj = { title: '' }) {
      for (let key in obj) {
         if (!obj[key] || obj[key] === 'null' || obj[key] === 'undefined') {
            delete obj[key];
         } else if (key === 'parentID') {
            obj[key] = pkg.Types.ObjectId(obj[key]);
         }
      }

      if (!obj.title || obj.title === '') return { success: false, message: 'Title is required' };

      try {
         const newcategories = new Categories(obj);

         await newcategories.save();

         return { success: true, categories: newcategories };
      } catch (error) {
         return { success: false, message: 'Registration failed!' };
      }
   }
   async update(obj = { title: '' }, _id) {
      for (let key in obj) {
         if (!obj[key] || obj[key] === 'null' || obj[key] === 'undefined') {
            delete obj[key];
         } else if (key === 'parentID') {
            obj[key] = pkg.Types.ObjectId(obj[key]);
         }
      }

      if (!obj.title || obj.title === '') return { success: false, message: 'Title is required' };

      try {
         const filter = { _id: pkg.Types.ObjectId(_id) };

         const updatedcategories = await Categories.findOneAndUpdate(filter, obj, {
            new: false,
            upsert: false,
         });

         if (!updatedcategories)
            return {
               success: false,
               message: 'categories not found or user not authoirised',
            };

         return {
            success: true,
            categories: updatedcategories,
         };
      } catch (error) {
         return { success: false, message: 'Updated categories failed!' };
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
