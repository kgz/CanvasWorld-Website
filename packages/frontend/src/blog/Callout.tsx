import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type CalloutProps = {
	children: ReactNode
	/** When set, the callout is a link with a trailing arrow. */
	to?: string
}

export function Callout({ children, to }: CalloutProps) {
	if (to) {
		return (
			<Link className="cw-callout cw-callout--link" to={to}>
				<span className="cw-callout__body">{children}</span>
				<span className="cw-callout__arrow" aria-hidden="true">
					→
				</span>
			</Link>
		)
	}
	return <div className="cw-callout">{children}</div>
}
