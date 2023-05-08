import { useSnippetStore } from '@/store';
import { desktopDir } from '@tauri-apps/api/path';
import { readDir, writeTextFile } from '@tauri-apps/api/fs';
import Editor, { OnChange, OnMount, OnValidate, BeforeMount } from '@monaco-editor/react';

import { FCC, useMemo, useState } from 'react';

type SnippetEditorProps = {};

const DIR_FILE = 'tauriFilesTest';

export const SnippetEditor: FCC<SnippetEditorProps> = (props) => {
	const snippetSelected = useSnippetStore((state) => state.snippetSelected);
	const resetSnippetSelected = useSnippetStore((state) => state.resetSnippetSelected);

	const [code, setCode] = useState<string | null>();
	const selected = useMemo(() => snippetSelected, [snippetSelected]);

	console.log('SnippetEditor:', selected);

	const handleSaveSnippet = async (): Promise<void> => {
		//* save
		try {
			const desktopPath = await desktopDir();
			await writeTextFile(`${desktopPath}/${DIR_FILE}/${selected?.name}`, code?.toString()!);
			resetSnippetSelected();
		} catch (err) {
			console.error(err);
		}
	};

	const handleEditorChange: OnChange = (value, event) => {
		// here is the current value
		//* Save in store
		setCode(value);
		// setSnippetSelected(value);
		// console.log('handleEditorChange():', value);
	};

	const handleEditorDidMount: OnMount = (editor, monaco) => {
		// console.log('onMount: the editor instance:', editor);
		// console.log('onMount: the monaco instance:', monaco);
	};

	const handleEditorWillMount: BeforeMount = (monaco) => {
		// console.log('beforeMount: the monaco instance:', monaco);
	};

	const handleEditorValidation: OnValidate = (markers) => {
		// model markers
		// markers.forEach((marker) => console.log('onValidate:', marker.message));
	};

	return (
		<div className='w-full h-full mx-auto flex justify-center flex-col items-center bg-neutral-600 rounded-2xl shadow-2xl shadow-neutral-950 overflow-hidden border-2 border-teal-700'>
			{selected && (
				<div className='w-full my-1 px-4 flex justify-between items-center'>
					<h3 className='text-lg font-semibold text-teal-300 mr-2'>
						File: <span className='text-white'>{selected?.name}</span>
					</h3>

					<button
						type='button'
						className='w-7 h-7 flex justify-center items-center bg-blue-600 text-white p-2 rounded-lg text-lg'
						onClick={handleSaveSnippet}
					>
						<i className='fas fa-save' />
					</button>
				</div>
			)}

			<div className='w-full h-full overflow-hidden'>
				{selected && (
					<Editor
						height='100%'
						width='100%'
						theme='vs-dark'
						defaultLanguage={'javascript'}
						language={selected?.fileType}
						defaultValue={selected?.code}
						onChange={handleEditorChange}
						onMount={handleEditorDidMount}
						beforeMount={handleEditorWillMount}
						onValidate={handleEditorValidation}
					/>
				)}
			</div>
		</div>
	);
};
