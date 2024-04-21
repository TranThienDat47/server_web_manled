import CustomerService from '../../services/CustomerService.js';

class CustomerController {
   async update(req, res) {
      const { title, description, parentID, _id } = req.body;

      try {
         const result = await CustomerService.update({ title, description, parentID }, _id);

         if (!result.success) return res.status(401).json(result);

         return res.json(result);
      } catch (error) {
         res.status(500).json({ success: false, message: 'Updated categories failed!' });
      }
   }
}

export default new CustomerController();
