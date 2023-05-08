import { readDir, readTextFile, removeFile } from '@tauri-apps/api/fs';
import { desktopDir } from '@tauri-apps/api/path';
import { type FCC, useEffect, useState, useMemo, useCallback } from 'react';

import { clsx as c } from 'clsx';

import { SelectedSnippetProps, useSnippetStore } from '@/store';

type SnippetListProps = {};

const DIR_FILE = 'tauriFilesTest';

export const SnippetList: FCC<SnippetListProps> = (props) => {
	const [isLoading, setIsLoading] = useState(false);

	const resetSnippetSelected = useSnippetStore((state) => state.resetSnippetSelected);
	const setSnippetSelected = useSnippetStore((state) => state.setSnippetSelected);
	const setSnippetsNames = useSnippetStore((state) => state.setSnippetsNames);
	const deleteSnippet = useSnippetStore((state) => state.deleteSnippet);
	const snippetSelected = useSnippetStore((state) => state.snippetSelected);
	const snippetsNames = useSnippetStore((state) => state.snippetsNames);
	const state = useSnippetStore((state) => state);

	const handleSelectedSnippet = async (selectedSnippet: SelectedSnippetProps): Promise<void> => {
		resetSnippetSelected();
		const desktopPath = await desktopDir();
		const getSnippet = await readTextFile(`${desktopPath}/${DIR_FILE}/${selectedSnippet.name}`);
		const getFileType = selectedSnippet?.name!.split('.')[1];
		setSnippetSelected({ name: selectedSnippet.name, code: getSnippet, fileType: getFileType });
		console.log('handleSelectedSnippet():', getFileType);
	};

	// const handleDeleteSnippet = async (name: string) => {
	// 	try {
	// 		await removeFile(`${await desktopDir()}/${DIR_FILE}/${name}`);
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// };

	const handleDeleteSnippet = useCallback(async (name: string) => {
		try {
			await removeFile(`${await desktopDir()}/${DIR_FILE}/${name}`);
			deleteSnippet(name);
		} catch (err) {
			console.error(err);
		}
	}, []);

	const data = useMemo(() => {
		return snippetsNames;
	}, [state]);

	// console.log('data', snippetsNames);

	useEffect(() => {
		(async () => {
			setIsLoading(true);

			try {
				const desktopPath = await desktopDir();
				const result = await readDir(`${desktopPath}/${DIR_FILE}`);
				const filesNames = result.map((file) => file.name!);
				console.log('SnippetList:', filesNames);
				if (filesNames.length) {
				}
				setSnippetsNames(filesNames);
				setIsLoading(false);
				console.log(filesNames);
			} catch (err) {
				setSnippetsNames([]);
				setIsLoading(false);
			}
		})();

		return () => {
			isLoading && setIsLoading(false);
		};
	}, []);

	return (
		<div className='w-80 h-50 mx-auto p-6 flex gap-4 justify-start flex-col items-center bg-neutral-800 rounded-2xl shadow-2xl shadow-neutral-950'>
			<h3 className='text-white text-xl font-medium'>Files: {snippetsNames.length}</h3>

			{!snippetsNames.length ? <span className='text-gray-400'>Empty list</span> : <></>}

			{isLoading ? (
				<div className='w-full flex flex-col gap-4'>
					{[1, 2, 3, 4].map((_, idx) => (
						<div
							key={idx + 1}
							className='animate-pulse w-full h-10 px-4 py-2 flex justify-start items-center bg-neutral-600 rounded-lg'
						>
							<div className='w-32 h-3 bg-neutral-500 rounded-lg'></div>
						</div>
					))}
				</div>
			) : (
				<ul className='w-full flex flex-col gap-4'>
					{data?.map((name) => (
						<li
							key={name}
							className='w-full h-10 flex justify-between items-center gap-2 px-4 py-2 rounded-lg cursor-pointer'
						>
							<div
								className={c(
									'w-full flex items-center gap-2 p-2 text-teal-400 rounded-lg',
									snippetSelected?.name === name
										? 'bg-teal-600 text-white'
										: 'bg-neutral-700 hover:bg-neutral-600 text-white',
								)}
								onClick={() => handleSelectedSnippet({ name })}
							>
								<i className='fa-regular fa-file mr-2'></i>
								{name}
							</div>

							<div className='p-2 bg-red-800 hover:bg-red-700 rounded-lg' onClick={() => handleDeleteSnippet(name)}>
								<i className='fa-regular fa-trash-can text-gray-100' />
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};
