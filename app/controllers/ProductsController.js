import { standardized } from '../../helpers/utils.js';

import ProductService from '../../services/ProductService.js';

class ProductsController {
   async show(req, res) {
      const { id = 0 } = req.params;

      try {
         await ProductService.getOne(id).then((result) => {
            if (!result.success) return res.status(401).json(result);

            return res.json(result);
         });
      } catch (error) {
         console.log(error, ' (Row - 9)');
         return res.status(500).json({ success: false, message: 'Get products failed!', error });
      }
   }

   async search(req, res) {
      const { skip, limit, key, recently = false } = req.query;

      var _key = '',
         _key_more = '';

      if (key) {
         _key = new RegExp(key);
         _key_more = new RegExp(standardized(key));
      }

      try {
         const results = await ProductService.search(
            skip,
            limit,
            {
               $or: [
                  { _name: { $regex: _key, $options: 'i' } },
                  { anotherName: { $regex: _key, $options: 'i' } },
                  { keySearch: { $regex: _key_more, $options: 'i' } },
               ],
            },
            recently,
         );

         if (results.success) return res.json(results);

         return res.status(401).json(results);
      } catch (error) {
         return res.status(500).json({ success: false, message: error.message });
      }
   }

   async add(req, res) {
      var {
         _name,
         description,
         anotherName,
         _status,
         img,
         episodes,
         view,
         releaseDate,
         news,
         reacts,
         categories,
         country_of_origin,
         background,
         keySearch,
      } = req.body;

      keySearch += ' ' + `${standardized(_name || '')} ${standardized(anotherName || '')}`;

      try {
         const result = await ProductService.add({
            _name,
            description,
            anotherName,
            _status,
            img,
            episodes,
            view,
            releaseDate,
            news,
            reacts,
            categories,
            keySearch,
            country_of_origin,
            background,
         });
         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         console.log(error, ' (Row - 50)');
         res.status(500).json({ success: false, message: 'Registration failed!' });
      }
   }

   async update(req, res) {
      const {
         _name,
         description,
         anotherName,
         _status,
         img,
         episodes,
         view,
         releaseDate,
         news,
         reacts,
         categories,
         country_of_origin,
         background,
      } = req.body;

      const _id = req.params.id;

      try {
         const result = await ProductService.update(
            {
               _name,
               description,
               anotherName,
               _status,
               img,
               episodes,
               view,
               releaseDate,
               news,
               reacts,
               categories,
               country_of_origin,
               background,
            },
            _id,
         );

         if (!result) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         console.log(error, ' (Row - 109)');
         res.status(500).json({ success: false, message: 'Updated products failed!' });
      }
   }

   async delete(req, res) {
      try {
         const _id = req.params.id;

         const result = await ProductService.delete(_id);

         if (!result) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         console.log(error, ' (Row - 130)');
         res.status(500).json({
            success: false,
            message: 'Get products failed! (ProductsController: Row - 131)',
         });
      }
   }
}

export default new ProductsController();
