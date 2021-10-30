import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/InputRichText.module.css'

const modules = {
	toolbar: [
		[{ header: [1, 2, false] }],
		['bold', 'italic', 'underline', 'strike', 'blockquote'],
		[
			{ list: 'ordered' },
			{ list: 'bullet' },
			{ indent: '-1' },
			{ indent: '+1' },
		],
		['link', 'code'],
		['clean'],
	],
};

const formats = [
	'header',
	'bold',
	'italic',
	'underline',
	'strike',
	'blockquote',
	'list',
	'bullet',
	'indent',
	'link',
	'code',
];


const InputRichText = ({ value, onChange, placeholder }) => {
	return (
		<>
			<ReactQuill
				theme="snow"
				value={value || ''}
				modules={modules}
				formats={formats}
				onChange={onChange}
				placeholder={placeholder}
			/>
		</>
	);
};

export default InputRichText;