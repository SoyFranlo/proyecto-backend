import express from 'express';
const viewsRouter = express.Router();

router.get('/', (req,res) => {
    res.render('index',{});
});
export default viewsRouter;