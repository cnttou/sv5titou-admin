import { Layout } from 'antd';

const { Footer } = Layout;

function FooterContent() {
	return (
		<Footer style={styles.footer}>
			Copyright © 2021 Trường Đại học Mở Thành Phố Hồ Chí Minh
			{/* <br /><span>Design ©2021</span> */}
		</Footer>
	);
}

const styles = {
	footer: {
		textAlign: 'center',
		borderTop: '1px solid #5262a5',
		marginTop: '10px',
        height: "47px",
		padding: '12px 50px',
	},
};

export default FooterContent;
