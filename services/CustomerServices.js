import pkg from 'mongoose';

import Custommer from '../app/models/Custommer.js';

class CustomerServices {
   async getOne(_id) {
      if (!_id.trim()) return { success: false, message: "'user_id' is required!" };

      try {
         const filter = { _id: pkg.Types.ObjectId(_id) };

         const customers = await Custommer.findOne(filter);

         return { success: true, customers };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async search(filter = {}, skip = -1, limit = Number.MAX_SAFE_INTEGER, valueSort = {}) {
      try {
         const option = {
            skip,
            limit,
         };

         if (valueSort !== null) option[sort] = valueSort;

         const custommers = await Custommer.find(filter, {}, option);

         return { success: true, custommers };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async getCustomerFollowProduct(product_id) {
      try {
         const filter = {};

         const custommers = await Custommer.find(filter, {}, option);

         return { success: true, custommers };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }
}

export default new CustomerServices();
