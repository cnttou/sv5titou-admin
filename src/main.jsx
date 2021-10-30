import ReactDOM from 'react-dom';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import vi_VN from 'antd/lib/locale/vi_VN';

ReactDOM.render(
	<Provider store={store}>
		<ConfigProvider locale={vi_VN}>
			<App />
		</ConfigProvider>
	</Provider>,
	document.getElementById('root')
);
