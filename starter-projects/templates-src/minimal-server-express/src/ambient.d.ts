/// <reference types="@gracile/gracile/ambient" />

declare namespace Gracile {
	interface Locals {
		requestId: import('node:crypto').UUID;
		userEmail: string | null;
	}
}
declare namespace Express {
	interface Locals extends Gracile.Locals {}
}
