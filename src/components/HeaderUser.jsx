import { Link, useLocation } from 'react-router-dom';
import { Menu, Layout, Image } from 'antd';
import {
	AppstoreAddOutlined,
	AppstoreOutlined,
	AuditOutlined,
	BulbOutlined,
	LogoutOutlined,
} from '@ant-design/icons';
import styles from '../styles/Header.module.css';
import { auth, logoutApi } from '../api/authentication';
import { useState } from 'react';

const { Header } = Layout;

export default function HeaderUser() {
    const [isLogin, setIsLogin] = useState(false);
    let location = useLocation();

    auth().onAuthStateChanged((user) => {
		if (user && user.uid) {
			setIsLogin(true)
		}
	});
    
	return (
		<Header className={styles.header} style={{ background: 'white' }}>
			<div className={styles.wrapperLogo}>
				<Image
					width={75}
					preview={false}
					src="/logo.png"
					alt="logo menu bar"
					className={styles.logo}
				/>
			</div>
			<Menu
				defaultSelectedKeys={['admin']}
				selectedKeys={[location.pathname.slice(1)]}
				mode="horizontal"
				className={styles.menu}
				expandIcon={false}
			>
				<Menu.Item key="admin" icon={<AppstoreOutlined />}>
					<Link to="/admin" className={styles.itemText}>
						Hoạt động
					</Link>
				</Menu.Item>
				<Menu.Item
					key="admin-manage-other-activity"
					icon={<AppstoreAddOutlined />}
				>
					<Link
						to="/admin-manage-other-activity"
						className={styles.itemText}
					>
						Hoạt động khác
					</Link>
				</Menu.Item>
				<Menu.Item key="admin-manage-slide" icon={<BulbOutlined />}>
					<Link to="/admin-manage-slide" className={styles.itemText}>
						Quảng cáo
					</Link>
				</Menu.Item>
				<Menu.Item key="admin-manage-user" icon={<AuditOutlined />}>
					<Link to="/admin-manage-user" className={styles.itemText}>
						Minh chứng theo tên SV
					</Link>
				</Menu.Item>
				<Menu.Item
					key="admin-manage-user-by-activity"
					icon={<AuditOutlined />}
				>
					<Link
						to="/admin-manage-user-by-activity"
						className={styles.itemText}
					>
						Minh chứng theo hoạt động
					</Link>
				</Menu.Item>
				<Menu.Item
					key="login"
					className="btnLogout"
					icon={
						<Link to="/login">
							<LogoutOutlined />
						</Link>
					}
					onClick={() => logoutApi()}
				>
					<Link to="/login" className={styles.itemText}>
						{isLogin ? 'Đăng xuất' : 'Đăng nhập'}
					</Link>
				</Menu.Item>
			</Menu>
		</Header>
	);
}
