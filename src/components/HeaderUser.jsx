import { Link } from 'react-router-dom';
import { Menu, Layout, Image } from 'antd';
import {
	AppstoreAddOutlined,
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
				<Menu.Item
					key="manage-activity"
					icon={
						<Link to="/admin">
							<AppstoreAddOutlined />
						</Link>
					}
				>
					<Link to="/admin" className={styles.itemText}>
						Quản lý hoạt động
					</Link>
				</Menu.Item>
				<Menu.Item
					key="manage-proof"
					icon={
						<Link to="/admin-manage-user">
							<AuditOutlined />
						</Link>
					}
				>
					<Link to="/admin-manage-user" className={styles.itemText}>
						Quản lý minh chứng
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
                    onClick={()=>logoutApi()}
				>
					<Link to="/login" className={styles.itemText}>
						{currentUser() ? 'Đăng xuất' : 'Đăng nhập'}
					</Link>
				</Menu.Item>
			</Menu>
		</Header>
	);
}
