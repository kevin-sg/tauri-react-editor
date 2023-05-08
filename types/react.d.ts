import type { FC, PropsWithChildren } from 'react';

declare module 'react' {
	type FCC<P = {}> = FC<PropsWithChildren<P>>;
}
