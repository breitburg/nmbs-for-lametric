/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


export default {
	async fetch(request, env, ctx): Promise<Response> {
		const response = await fetch('https://api.irail.be/connections/?from=Leuven&to=Brussels-Central&format=json');
		const trains: { connection: any[] } = await response.json();

		const data = {
			frames: trains.connection.slice(0, 3).map((train) => {
				const departureTime = new Date(train.departure.time * 1000).toLocaleTimeString('en-GB', { timeZone: 'Europe/Brussels', hour12: false, hour: '2-digit', minute: '2-digit' });
				const arrivalTime = new Date(train.arrival.time * 1000).toLocaleTimeString('en-GB', { timeZone: 'Europe/Brussels', hour12: false, hour: '2-digit', minute: '2-digit' });
				const platform = train.departure.platform;

				return {
					text: `${departureTime} (${platform}) → ${arrivalTime}`,
					icon: 64446,
				};
			}),
		};

		return Response.json(data);
	},
} satisfies ExportedHandler<Env>;
