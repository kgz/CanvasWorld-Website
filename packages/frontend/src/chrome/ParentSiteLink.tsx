export const PARENT_SITE_HREF = 'https://matf.dev/'
export const PARENT_SITE_LABEL = 'matf.dev'

export function ParentSiteLink({ className }: { className?: string }) {
	return (
		<a className={className} href={PARENT_SITE_HREF}>
			{PARENT_SITE_LABEL}
		</a>
	)
}

export function SiteFooter({ className, aboutId }: { className: string; aboutId?: string }) {
	return (
		<footer className={className} id={aboutId}>
			<p>Interactive sketches of classical dynamical systems.</p>
			<ParentSiteLink />
		</footer>
	)
}
