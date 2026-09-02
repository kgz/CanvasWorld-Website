import { Suspense, type ComponentType } from 'react'
import styles from '../pages/canvasChrome.module.css'

type VizPageStageProps = {
	Page: ComponentType
}

export function VizPageStage({ Page }: VizPageStageProps) {
	return (
		<Suspense
			fallback={
				<div className={styles.stageLoading} aria-hidden="true">
					Loading…
				</div>
			}
		>
			<Page />
		</Suspense>
	)
}
