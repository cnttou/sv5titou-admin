import { Link } from 'react-router-dom';
import { Menu, Layout, Image } from 'antd';
import {
	AppstoreAddOutlined,
	AppstoreOutlined,
	AuditOutlined,
	LogoutOutlined,
} from '@ant-design/icons';
import styles from '../styles/Header.module.css';
import { currentUser, logoutApi } from '../api/authentication';

const { Header } = Layout;

export default function HeaderUser() {
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
				mode="horizontal"
				className={styles.menu}
				expandIcon={false}
			>
				<Menu.Item key="manage-activity" icon={<AppstoreOutlined />}>
					<Link to="/admin" className={styles.itemText}>
						Quản lý hoạt động
					</Link>
				</Menu.Item>
				<Menu.Item
					key="manage-other-activity"
					icon={<AppstoreAddOutlined />}
				>
					<Link
						to="/admin-manage-other-activity"
						className={styles.itemText}
					>
						Quản lý hoạt động khác
					</Link>
				</Menu.Item>
				<Menu.Item key="manage-proof" icon={<AuditOutlined />}>
					<Link to="/admin-manage-user" className={styles.itemText}>
						Quản lý minh chứng theo tên SV
					</Link>
				</Menu.Item>
				<Menu.Item key="manage-proof-by-activity" icon={<AuditOutlined />}>
					<Link
						to="/admin-manage-user-by-activity"
						className={styles.itemText}
					>
						Quản lý minh chứng theo hoạt động
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
						{currentUser() ? 'Đăng xuất' : 'Đăng nhập'}
					</Link>
				</Menu.Item>
			</Menu>
		</Header>
	);
}
