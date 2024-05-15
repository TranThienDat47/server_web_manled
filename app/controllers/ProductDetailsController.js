import ProductDetailService from '../../services/ProductDetailService.js';

class ProductDetailsController {
   async show(req, res) {
      const _id = req.params.id;

      try {
         const result = await ProductDetailService.get(_id);

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         return res.status(500).json({ success: false, message: 'Get product_details failed!' });
      }
   }

   async showOfParent(req, res) {
      const _id = req.params.id;
      try {
         const result = await ProductDetailService.getOfParent(_id);

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         return res.status(500).json({ success: false, message: 'Get product_details failed!' });
      }
   }

   async add(req, res) {
      const { product_id, video_ref, description, title, src, image, episode } = req.body;

      try {
         const result = await ProductDetailService.add({
            product_id,
            video_ref,
            description,
            title,
            src,
            image,
            episode,
         });

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         res.status(500).json({ success: false, message: 'Registration failed!' });
      }
   }

   async update(req, res) {
      const { product_id, _state, description, title, src, image, episode } = req.body;
      const _id = req.params.id;

      try {
         const result = await ProductDetailService.update(
            { product_id, _state, description, title, src, image, episode },
            _id,
         );

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         console.log(error, ' (Row - 50)');
         res.status(500).json({ success: false, message: 'Registration failed!' });
      }
   }

   async like(req, res) {
      const { parrent_id, user_id } = req.body;

      try {
         return await ProductDetailService.like({ parrent_id, user_id })
            .then(async (tempResult) => {
               if (tempResult.success) {
                  const result = await ProductDetailService.update(
                     { $inc: { reacts: 1 } },
                     parrent_id,
                  );

                  if (!result.success) return res.status(401).json(result);

                  return res.json(result);
               } else {
                  return res.status(401).json(res);
               }
            })
            .catch((err) => {
               return res.status(500).json({ success: false, message: 'like failed!' });
            });
      } catch (error) {
         console.log(error, ' (Row - 50)');
         res.status(500).json({ success: false, message: 'Registration failed!' });
      }
   }

   async dislike(req, res) {
      const { parrent_id, user_id } = req.body;

      try {
         return await ProductDetailService.dislike({ parrent_id, user_id })
            .then(async (tempResult) => {
               if (tempResult.success) {
                  const { success, product_details } = await ProductDetailService.get(parrent_id);

                  if (!success) {
                     return res.status(404).json({ success: false, message: 'Product not found' });
                  }

                  const product = product_details[0];

                  if (product.reacts === 0) {
                     return res
                        .status(400)
                        .json({ success: false, message: 'Reacts already at 0' });
                  }

                  const result = await ProductDetailService.update(
                     { $inc: { reacts: -1 } },
                     parrent_id,
                  );

                  if (!result.success) return res.status(401).json(result);

                  return res.json(result);
               } else {
                  return res.status(401).json(res);
               }
            })
            .catch((err) => {
               console.log(err);
               return res.status(500).json({ success: false, message: 'dislike failed!' });
            });
      } catch (error) {
         console.log(error, ' (Row - 50)');
         res.status(500).json({ success: false, message: 'Registration failed!' });
      }
   }

   async checkUserLike(req, res) {
      const { parrent_id, user_id } = req.body;

      try {
         const result = await ProductDetailService.checkUserLike({ parrent_id, user_id });

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         console.log(error, ' (Row - 50)');
         res.status(500).json({ success: false, message: 'Registration failed!' });
      }
   }

   async increaseView(req, res) {
      const _id = req.params.id;

      try {
         const result = await ProductDetailService.update({ $inc: { views: 1 } }, _id);

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         console.log(error, ' (Row - 50)');
         res.status(500).json({ success: false, message: 'Registration failed!' });
      }
   }

   async delete(req, res) {
      const _id = req.params.id;

      try {
         const result = await ProductDetailService.delete(_id);

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         return res.status(500).json({
            success: false,
            message: 'Get products failed! (ProductDetailsController: Row - 131)',
         });
      }
   }
}

export default new ProductDetailsController();
