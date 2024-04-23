import ProductDetailService from '../../services/ProductDetailService.js';

class ProductDetailsController {
   async show(req, res) {
      const _id = req.params.id;

      try {
         const result = await ProductDetailService.getOfParent(_id);

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
