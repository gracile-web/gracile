import { defineRoute } from '@gracile/gracile/route';

function enqueue(
	controller: ReadableStreamDefaultController<string>,
	data: string,
) {
	return controller.enqueue(`data: ${data}\n\n`);
}

const INTERVAL_MS = 1000;

export default defineRoute({
	handler: () => {
		let intervalId: ReturnType<typeof setInterval>;

		const body = new ReadableStream<string>({
			start(controller) {
				enqueue(controller, 'Hello World!');

				intervalId = setInterval(() => {
					const data = `— Ping! — ${new Date().toISOString()} —`;

					enqueue(controller, data);
				}, INTERVAL_MS);
			},

			cancel: () => clearInterval(intervalId),
		});

		return new Response(body, {
			headers: { 'content-type': 'text/event-stream' },
		});
	},
});
