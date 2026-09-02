import {
	autoUpdate,
	flip,
	offset,
	shift,
	useFloating,
} from '@floating-ui/react-dom'
import {
	useCallback,
	useEffect,
	useId,
	useRef,
	useState,
	type KeyboardEvent,
	type ReactNode,
} from 'react'
import { getGlossaryEntry } from './terms'
import styles from './GlossaryTerm.module.css'

type GlossaryTermProps = {
	term: string
	children?: ReactNode
}

function useCoarsePointer() {
	const [coarse, setCoarse] = useState(false)

	useEffect(() => {
		const mq = window.matchMedia('(pointer: coarse)')
		const update = () => setCoarse(mq.matches)
		update()
		mq.addEventListener('change', update)
		return () => mq.removeEventListener('change', update)
	}, [])

	return coarse
}

export function GlossaryTerm({ term, children }: GlossaryTermProps) {
	const entry = getGlossaryEntry(term)
	const label = children ?? entry?.label ?? term
	const panelId = useId()
	const titleId = useId()
	const rootRef = useRef<HTMLSpanElement>(null)
	const [open, setOpen] = useState(false)
	const coarse = useCoarsePointer()

	const { refs, floatingStyles } = useFloating({
		open,
		onOpenChange: setOpen,
		placement: 'top',
		middleware: [offset(8), flip(), shift({ padding: 8 })],
		whileElementsMounted: autoUpdate,
	})

	const close = useCallback(() => setOpen(false), [])
	const toggle = useCallback(() => setOpen((value) => !value), [])

	useEffect(() => {
		if (!import.meta.env.DEV || entry) return
		console.warn(`[GlossaryTerm] unknown term slug: "${term}"`)
	}, [entry, term])

	useEffect(() => {
		if (!open) return
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') close()
		}
		document.addEventListener('keydown', onKeyDown)
		return () => document.removeEventListener('keydown', onKeyDown)
	}, [close, open])

	useEffect(() => {
		if (!open) return
		const onPointerDown = (event: PointerEvent) => {
			const root = rootRef.current
			if (!root || !(event.target instanceof Node)) return
			if (!root.contains(event.target)) close()
		}
		document.addEventListener('pointerdown', onPointerDown)
		return () => document.removeEventListener('pointerdown', onPointerDown)
	}, [close, open])

	if (!entry) {
		return <>{label}</>
	}

	const openFromHover = () => {
		if (!coarse) setOpen(true)
	}

	const closeFromHover = () => {
		if (!coarse) setOpen(false)
	}

	const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			toggle()
		}
		if (event.key === 'Escape') close()
	}

	return (
		<span
			ref={rootRef}
			className={styles.wrap}
			onMouseEnter={openFromHover}
			onMouseLeave={closeFromHover}
		>
			<button
				ref={refs.setReference}
				type="button"
				className={styles.term}
				aria-expanded={open}
				aria-controls={panelId}
				aria-labelledby={open ? titleId : undefined}
				onClick={coarse ? toggle : undefined}
				onFocus={openFromHover}
				onBlur={(event) => {
					if (coarse) return
					const root = rootRef.current
					const next = event.relatedTarget
					if (root && next instanceof Node && root.contains(next)) return
					close()
				}}
				onKeyDown={onTriggerKeyDown}
			>
				{label}
			</button>
			{open ? (
				<div
					ref={refs.setFloating}
					id={panelId}
					role="dialog"
					aria-labelledby={titleId}
					className={styles.panel}
					style={floatingStyles}
				>
					<p id={titleId} className={styles.title}>
						{entry.label}
					</p>
					<p className={styles.definition}>{entry.definition}</p>
					{entry.context ? <p className={styles.context}>{entry.context}</p> : null}
				</div>
			) : null}
		</span>
	)
}
