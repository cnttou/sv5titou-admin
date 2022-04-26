import { lazy } from 'react';
import AdminManageSlide from '../pages/AdminManageSlide';

const AdminManageUserByActivity = lazy(() => import('../pages/AdminManageUserByActivity'));
const LoginAdmin = lazy(() => import('../pages/LoginAdmin'));
const PageNotFound = lazy(() => import('../pages/PageNotFound'));
const AdminManageUser = lazy(() => import('../pages/AdminManageUser'));
const AdminManageActivity = lazy(() => import('../pages/AdminManageActivity'));

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
