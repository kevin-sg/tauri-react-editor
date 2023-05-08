import { writeTextFile } from '@tauri-apps/api/fs';
import { desktopDir } from '@tauri-apps/api/path';

import { ChangeEvent, FCC, FormEvent, useCallback, useState } from 'react';

type SnippetFormProps = {};

const DIR_FILE = 'tauriFilesTest';

type StatusError = {
	message?: string;
	isError: boolean;
};

export const SnippetForm: FCC<SnippetFormProps> = (props) => {
	const [snippetName, setSnippetName] = useState('');
	const [statusError, setStatusError] = useState<StatusError | null>();

	const handleChange = ({ target }: ChangeEvent<HTMLInputElement>): void => {
		const value = target.value.trim();
		value.length > 2 && setStatusError({ isError: false });
		setSnippetName(value);
	};

	const handleSubmit = async (ev: FormEvent<HTMLFormElement>): Promise<void> => {
		ev.preventDefault();
		if (!snippetName.length) {
			setStatusError({ message: 'Please write something', isError: true });
			return;
		}
		if (snippetName.length < 3) {
			setStatusError({ message: 'Min. 3 characters', isError: true });
			return;
		}

		console.log('handleSubmit', true);

		//* Create a snippet
		const desktopPath = await desktopDir();
		const test = snippetName.includes('.') ? snippetName : `${snippetName}.json`;

		await writeTextFile(`${desktopPath}/${DIR_FILE}/${test}`, '{}');
		setSnippetName('');
		setStatusError({ isError: false });
	};

	return (
		<div className='w-80 h-60- p-6 mx-auto mb-10 flex justify-start flex-col gap-4 items-center bg-neutral-800 rounded-2xl shadow-2xl shadow-neutral-950'>
			<h1 className='text-xl text-center font-bold'>Create file</h1>
			<p className='text-sm text-gray-400'>
				Default file type: <span className='text-yellow-600'>json</span>
			</p>

			<form noValidate autoComplete='off' onSubmit={handleSubmit} className='w-full flex flex-col gap-4'>
				<div>
					<label htmlFor='snippetName' className='sr-only'>
						Name:
					</label>
					<input
						type='text'
						name='snippetName'
						placeholder='hello.json'
						className='block w-full p-2.5 mb-2 bg-neutral-700 rounded-lg border border-neutral-700 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-transparent placeholder:text-gray-400'
						onChange={handleChange}
					/>

					{snippetName && (
						<p className='text-sm text-gray-400'>
							Final result: <span className='text-yellow-600'>{snippetName}</span>
						</p>
					)}

					{statusError?.isError && (
						<span className='text-red-400 ml-1 text-sm'>
							<i className='fa-solid fa-circle-exclamation mr-2'></i>
							{statusError?.message}
						</span>
					)}
				</div>
				<button type='submit' className='bg-blue-600 text-white px-4 py-2.5 rounded-lg w-full'>
					Submit
				</button>
			</form>
		</div>
	);
};

export default SnippetForm;
