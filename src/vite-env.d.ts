/// <reference types="vite/client" />


declare module '@t/*';
declare module '@p/*';
declare module '@s/*';

declare const unserialize: any
declare const _: any
declare const exportInvoices: (button?: HTMLElement, actionType?: 'revert'|'export', software?: string) => void

// add png support
declare module "*.png" {
	const value: any;
	export default value;
}
