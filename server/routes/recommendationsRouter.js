import Router from 'express';

const recommendationsRouter = Router();

recommendationsRouter.post('/post', (req, res) => {
    // Logic to recommend a post
});

recommendationsRouter.post('/user', (req, res) => {
    // Logic to recommend a user
});

export default recommendationsRouter;