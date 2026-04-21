import { Router } from 'express';
import { userRoute } from '../modules/user/user.route';

const router = Router();
const modules = [
  {
    path: '/user',
    route: userRoute,
  },
];

// app.use('/api/user', userRouter);

modules.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
