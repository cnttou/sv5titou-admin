import AdminManageSlide from '../pages/AdminManageSlide';
import AdminManageActivity from '../pages/AdminManageActivity';
import AdminManageUserByActivity from '../pages/AdminManageUserByActivity';
import AdminManageUser from '../pages/AdminManageUser';
import PageNotFound from '../pages/PageNotFound';
import LoginAdmin from '../pages/LoginAdmin';

const routes = [
	{
		path: '/login',
		component: LoginAdmin,
		exact: true,
		private: false,
	},
	{
		path: '/admin',
		component: AdminManageActivity,
		exact: true,
		private: true,
	},
	{
		path: '/admin-manage-slide',
		component: AdminManageSlide,
		exact: true,
		private: true,
	},
	{
		path: '/admin-manage-user',
		component: AdminManageUser,
		exact: true,
		private: true,
	},
	{
		path: '/admin-manage-user-by-activity',
		component: AdminManageUserByActivity,
		exact: true,
		private: true,
	},
	{
		path: '*',
		component: PageNotFound,
		private: false,
	},
];

export default routes;
