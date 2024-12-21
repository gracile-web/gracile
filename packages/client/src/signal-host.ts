// FROM: https://lit.dev/playground/#gist=3a8740445931d4d3745509b093cec034

import type { WatchDirective } from '@lit-labs/signals';

export class SignalHost {
	private isPendingUpdate = false;

	private __pendingWatches = new Set<WatchDirective<unknown>>();

	protected _updateWatchDirective(directive: WatchDirective<unknown>): void {
		this.__pendingWatches.add(directive);
		this.requestUpdate();
	}
	protected _clearWatchDirective(directive: WatchDirective<unknown>): void {
		this.__pendingWatches.delete(directive);
	}

	protected requestUpdate() {
		if (this.isPendingUpdate) return;

		this.isPendingUpdate = true;

		queueMicrotask(() => {
			try {
				for (const directive of this.__pendingWatches) directive.commit();
			} catch {
				// Empty
			} finally {
				this.__pendingWatches.clear();
			}

			this.isPendingUpdate = false;
		});
	}
}
