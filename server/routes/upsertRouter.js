import Router from 'express';
import upsertPostController from '../controllers/upsertPostController.js';
import upsertUserController from '../controllers/upsertUserController.js';
const upsertRouter = Router();

upsertRouter.post('/post', upsertPostController);

upsertRouter.post('/user', appwriteAuth, upsertUserController);

export default upsertRouter;