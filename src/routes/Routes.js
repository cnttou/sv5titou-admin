import { lazy } from 'react';

const AdminManageOtherActivity = lazy(() => import('../pages/AdminManageOtherActivity'));
const LoginAdmin = lazy(() => import('../pages/LoginAdmin'));
const PageNotFound = lazy(() => import('../pages/PageNotFound'));
const AdminManageUser = lazy(() => import('../pages/AdminManageUser'));
const AdminManageNews = lazy(() => import('../pages/AdminManageNews'));

const routes = [
	{
		path: '/login',
		component: LoginAdmin,
		exact: true,
		private: false,
	},
	{
		path: '/admin',
		component: AdminManageNews,
		exact: true,
		private: true,
	},
	{
		path: '/admin-manage-other-activity',
		component: AdminManageOtherActivity,
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
		path: '*',
		component: PageNotFound,
		private: false,
	},
];

export default routes;
