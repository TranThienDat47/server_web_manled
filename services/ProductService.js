import pkg from 'mongoose';

import Products from '../app/models/Products.js';
import ProductDetails from '../app/models/ProductDetail.js';

class ProductServices {
   async getOne(_id) {
      try {
         const filter = {
            _id: pkg.Types.ObjectId(_id),
         };
         const findDoc = {};
         const options = {};

         const products = await Products.find(filter, findDoc, options);
         const productDetails = await ProductDetails.find({
            product_id: pkg.Types.ObjectId(_id),
            _state: { $ne: 'Bản nháp' },
         });

         return { success: true, products: products[0] || {}, productDetails };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async search(skip = 0, limit = Number.MAX_SAFE_INTEGER, filter = {}, recently) {
      try {
         const options = { skip, limit };

         if (options.limit === 'null' || !options.limit) delete options.limit;

         if (recently) options.sort = { createdAt: -1 };

         const products = await Products.find(filter, {}, options);

         return { success: true, products };
      } catch (error) {
         return { success: true, message: error.message };
      }
   }

   async getProductOfCategory({
      categories_id,
      skip = 0,
      limit = Number.MAX_SAFE_INTEGER,
      recently,
   }) {
      try {
         const options = { skip, limit };
         const filter = {};

         if (options.limit === 'null' || !options.limit) delete options.limit;

         if (recently) options.sort = { createdAt: -1 };
         else options.sort = { createdAt: 1 };

         if (categories_id) {
            filter.categories = { $elemMatch: { _id: categories_id } };
         }

         const products = await Products.find(filter, {}, options);

         return { success: true, products };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async add(
      obj = {
         _name,
         description,
         anotherName,
         _status,
         img,
         episodes,
         view,
         releaseDate,
         reacts,
         categories,
         keySearch,
         country_of_origin,
      },
   ) {
      if (!obj._name || !obj.img || !obj.categories || !obj.description)
         return { success: false, message: '"_name, img, categories, description" is required' };

      try {
         const newProducts = new Products(obj);

         await newProducts.save();

         return { success: true, products: newProducts };
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async update(updateDOC = {}, _id) {
      for (let key in updateDOC) {
         if (!updateDOC[key] || updateDOC[key] === 'null' || updateDOC[key] === 'undefined') {
            delete updateDOC[key];
         }
      }

      try {
         const filter = { _id: pkg.Types.ObjectId(_id) };
         const updatedProduct = await Products.findOneAndUpdate(filter, updateDOC, {
            new: false,
            upsert: false,
         });

         if (!updatedProduct)
            return {
               success: false,
               message: 'Products not found or user not authoirised',
            };

         return {
            success: true,
            products: updatedProduct,
         };
      } catch (error) {
         return {
            success: false,
            message: error.message,
         };
      }
   }

   async delete(_id) {
      try {
         const filter = { _id: pkg.Types.ObjectId(_id) };
         const deletedProduct = await Products.findOneAndDelete(filter);

         if (!deletedProduct)
            return {
               success: false,
               message:
                  'Products not found or user not authoirised (ProductsController: Row - 122)',
            };

         return {
            success: true,
            products: deletedProduct,
         };
      } catch (error) {
         console.log(error, ' (Row - 130)');
         return {
            success: false,
            message: error.message,
         };
      }
   }
}

export default new ProductServices();
