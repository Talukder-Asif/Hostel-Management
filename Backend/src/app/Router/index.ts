import { Router } from 'express';
import { StudentRoutes } from '../modules/student/student.route';
import { UserRoutes } from '../modules/user/user.route';
import { AdminRouter } from '../modules/admin/admin.route';
import { AuthRoute } from '../modules/Auth/auth.route';

const router = Router();
const modules = [
	{
		path: '/students',
		route: StudentRoutes,
	},
	{
		path: '/users',
		route: UserRoutes,
	},
	{
		path: '/admins',
		route: AdminRouter,
	},
	{
		path: '/auth',
		route: AuthRoute,
	},
];

modules.forEach((route) => {
	router.use(route.path, route.route);
});

export default router;
