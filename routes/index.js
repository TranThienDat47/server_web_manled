import authRouter from './auth.js';
import videoRouter from './video.js';
import productsRouter from './products.js';
import commentsRouter from './comments.js';
import categoriesRouter from './categories.js';
import notificationRouter from './notifications.js';
import productDetailsRouter from './productDetails.js';
import globalNotificationRouter from './globalNotifications.js';
import passportGoogleOauthRouter from './passportGoogleOauth.js';

const route = (app) => {
   app.use('/api/auth', authRouter);
   app.use('/api/video', videoRouter);
   app.use('/api/products', productsRouter);
   app.use('/api/comments', commentsRouter);
   app.use('/api/categories', categoriesRouter);
   app.use('/api/auth/google', passportGoogleOauthRouter);
   app.use('/api/notification', notificationRouter);
   app.use('/api/product_details', productDetailsRouter);
   app.use('/api/global_notification', globalNotificationRouter);
};

export default route;
