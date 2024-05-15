import pkg from 'mongoose';

import ProductDetails from '../app/models/ProductDetail.js';
import LikeProductDetail from '../app/models/LikeProductDetail.js';

class ProductDetailService {
   async get(_id) {
      try {
         const filter = { _id: pkg.Types.ObjectId(_id) };
         const product_details = await ProductDetails.find(filter);
         return { success: true, product_details };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async getOfParent(_id) {
      try {
         const filter = {
            product_id: pkg.Types.ObjectId(_id),
            // _state: { $ne: 'Bản nháp' },
         };
         const product_details = await ProductDetails.find(filter);
         return { success: true, product_details };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async add({ product_id, video_ref, description, title, image, episode }) {
      try {
         var obj = { product_id, video_ref, description, title, image, episode };

         const product_details = new ProductDetails(obj);

         await product_details.save();

         return { success: true, product_details };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async like({ parrent_id, user_id }) {
      try {
         const filter = { parrent_id, user_id };
         const update = { parrent_id, user_id };
         const options = { upsert: true, new: false };

         const existingLike = await LikeProductDetail.findOne(filter);

         if (existingLike) {
            return { success: false, message: 'Like already exists for this user and parent_id' };
         }

         const likeModel = await LikeProductDetail.findOneAndUpdate(filter, update, options);

         return { success: true, likeModel };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async dislike({ parrent_id, user_id }) {
      try {
         const filter = { parrent_id, user_id };

         const dislikeModel = await LikeProductDetail.findOneAndDelete(filter);

         if (!dislikeModel) {
            return { success: false, message: 'Không tìm thấy bản ghi để xóa.' };
         }

         return { success: true, dislikeModel };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async checkUserLike({ parrent_id, user_id }) {
      try {
         const filter = { parrent_id, user_id };

         const existingLike = await LikeProductDetail.findOne(filter);

         if (existingLike) {
            return { success: true, isLike: true };
         }
         return { success: true, isLike: false };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async update(obj = {}, _id) {
      for (let key in obj) {
         if (!obj[key] || obj[key] === 'null' || obj[key] === 'undefined') {
            delete obj[key];
         }
      }

      try {
         const filter = { _id: pkg.Types.ObjectId(_id) };

         const options = {
            new: false,
            upsert: false,
         };

         const updateProductDetail = await ProductDetails.findOneAndUpdate(filter, obj, options);

         if (!updateProductDetail)
            return {
               success: false,
               message: 'Product Detail not found or user not authoirised',
            };

         return { success: true, updateProductDetail };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async delete(_id) {
      try {
         const filter = { _id: pkg.Types.ObjectId(_id) };
         const deletedProductDetails = await ProductDetails.findOneAndDelete(filter);

         if (!deletedProductDetails)
            return {
               success: false,
               message: 'ProductDetail not found or user not authoirised',
            };

         return {
            success: true,
            product_detail: deletedProductDetails,
         };
      } catch (error) {
         return {
            success: false,
            message: error.message,
         };
      }
   }
}

export default new ProductDetailService();
