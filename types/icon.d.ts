import * as React from 'react';

declare module '*.svg' {
	type ReactComponent = React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
	export default ReactComponent;
}
