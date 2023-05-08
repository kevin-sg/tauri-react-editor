import { useCallback, useMemo } from 'react';
import { create } from 'zustand';

export interface SelectedSnippetProps {
	name?: string;
	code?: string;
	fileType?: string;
}

interface SnippetState {
	snippetSelected?: SelectedSnippetProps;
	snippetsNames: string[];
	setSnippetName: (name: string) => void;
	setSnippetsNames: (name: string[]) => void;
	setSnippetSelected: (props: SelectedSnippetProps) => void;
	resetSnippetSelected: () => void;
	deleteSnippet: (name: string) => void;
}

export const useSnippetStore = create<SnippetState>((set) => ({
	snippetsNames: [],
	snippetSelected: undefined,
	setSnippetName: (name) => set((state) => ({ snippetsNames: [...state.snippetsNames, name] })),
	setSnippetsNames: (names) => set((state) => ({ snippetsNames: names })),
	setSnippetSelected: (props: SelectedSnippetProps) =>
		set((state) => ({
			snippetSelected: { name: props.name, code: props.code?.toString(), fileType: props.fileType || 'json' },
		})),
	resetSnippetSelected: () => set((state) => ({ snippetSelected: undefined })),
	deleteSnippet: (name) =>
		set((state) => ({ snippetsNames: state.snippetsNames.filter((snippetName) => snippetName !== name) })),
}));

// export const useStoreProp = (prop: keyof SnippetState) => {
//   const selector = useMemo<SnippetState>((state) => state[prop], [prop])
//   return useSnippetStore<SnippetState>()
// }
