import type { FCC } from 'react';

// import { ReactComponent as TauriSvg } from '@/assets/tauri.svg';

type TauriIconProps = {
	className?: string;
};

export const TauriIcon: FCC<TauriIconProps> = (props) => {
	return <div className={props.className ?? ''}>{/* <TauriSvg /> */}</div>;
};
