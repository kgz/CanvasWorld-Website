export type Styles = {
	active: string
	awesome: string
	body: string
	canvas: string
	card: string
	colorChange: string
	container: string
	desc: string
	divider: string
	drawerOpenButton: string
	header: string
	headerBreaker: string
	manuBar: string
	menu: string
	menuItem: string
	title: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
