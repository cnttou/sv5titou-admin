import { Layout, message, Typography } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { auth, loginWithEmailPasswordApi } from '../api/authentication';
import { Form, Input, Button } from 'antd';
import styles from '../styles/Login.module.css';

const { Title } = Typography;
const { Content } = Layout;

const regxEmail =
	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

export default function LoginAdmin() {
	let history = useHistory();
	let location = useLocation();

	let { from } = location.state || { from: { pathname: '/admin' } };

	auth().onAuthStateChanged((user) => {
		if (user && user.uid) {
			history.replace(from);
		}
	});

	const onFinish = (values) => {
		let username = values.username.toString();
		let password = values.password.toString();
		loginWithEmailPasswordApi(username, password)
			.then(() => {
				history.push('/admin');
			})
			.catch((error) => {
				message.warning('Thông tin đăng nhập không đúng!');
				console.log(error.errorMessage);
			});
	};

	return (
		<Content className={styles.content}>
			<div className="container-md AdminLogin">
				<Title
					level={5}
					style={{ textAlign: 'center', marginBottom: 10 }}
				>
					ĐĂNG NHẬP
				</Title>
				<Form
					name="basic"
					labelCol={{ span: 8 }}
					wrapperCol={{ span: 16 }}
					initialValues={{ remember: true }}
					onFinish={onFinish}
					autoComplete="on"
				>
					<Form.Item
						label="Username"
						name="username"
						rules={[
							{
								required: true,
								message: 'Vui lòng nhập username!',
							},
							{
								pattern: regxEmail,
								required: true,
								message: 'Vui lòng nhập đúng định dạng mail!',
							},
						]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						label="Password"
						name="password"
						rules={[
							{
								min: 6,
								required: true,
								message: 'Mật khẩu phải từ 6 ký tự!',
							},
							{
								required: true,
								message: 'Vui lòng nhập password!',
							},
						]}
					>
						<Input.Password />
					</Form.Item>

					<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
						<Button type="primary" htmlType="submit">
							Đăng nhập
						</Button>
					</Form.Item>
				</Form>
			</div>
		</Content>
	);
}
