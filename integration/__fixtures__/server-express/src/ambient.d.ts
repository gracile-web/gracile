/// <reference types="@gracile/gracile/ambient" />

declare namespace App {
	interface Locals {
		requestId?: import('node:crypto').UUID;
	}
}
