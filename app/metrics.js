const client = require('prom-client');

module.exports = (registry) => {
	const states = {
		completed: 'COMPLETED',
		draft: 'DRAFT',
		invited: 'INVITED',
		noaBuyer: 'NOA_BUYER',
		noaOps: 'NOA_OPS',
		rejected: 'REJECTED',
	}
	const stateOrder = [states.draft, states.invited, states.noaOps, states.noaBuyer, states.completed];

	const enrollments = [];
	let day = 0;

	const gauge = new client.Gauge({
		name: 'cash_current_enrollments_count',
		help: 'Count of enrollments per state right now',
		registers: [registry],
		labelNames: [
			'cash_enrollment_state',
			'cash_product',
			'cash_program',
		],
	});

	const histogram = new client.Histogram({
		name: 'cash_time_spent_per_enrollment_state_in_days',
		help: 'Number of days spent in an enrollment state',
		registers: [registry],
		buckets: [1, 2, 3, 5, 7, 14, 21, 28, 35, 42, 100],
		labelNames: [
			'cash_enrollment_state',
			'cash_product',
			'cash_program',
		],
	});

	const runCashProgram = () => {
		console.log('Another day at the office...');
		enrollments.forEach(enrollment => {
			if (enrollment.state === states.completed || enrollment.state === states.rejected) {
				return;
			}
			if (Math.random() <= 0.01) {
				enrollment.state = states.rejected;
				enrollment.modified = day;
				console.log(`Marking enrollment ${enrollment.id} as ${enrollment.state} on ${enrollment.modified}`);
				return;
			}
			if (Math.random() <= 0.20) {
				const labels = {
					'cash_enrollment_state': enrollment.state,
					'cash_product': 'BLACKSTAR RF',
					'cash_program': 'K+N UK Sellers',
				};
				const value = day - enrollment.modified;
				histogram.observe(labels, value);

				const index = stateOrder.findIndex(state => enrollment.state === state);
				enrollment.state = stateOrder[index + 1];
				enrollment.modified = day;
				console.log(`Marking enrollment ${enrollment.id} as ${enrollment.state} on ${enrollment.modified}`);
				return;
			}
		})
		const newEnrollmentsToCreate = 3;
		Array.from(Array(newEnrollmentsToCreate), (v, i) => i).map(() => {
			const id = enrollments.length + 1;
			const state = states.draft;
			const modified = day;
			enrollments.push({ id, state, modified });
			console.log(`Creating enrollment ${id} as ${state} on ${modified}`);
		})

		day = day + 1;
	}

	setInterval(runCashProgram, 4000);

	const countEnrollments = () => {
		Object.keys(states).map((state) => {
			const count = enrollments.filter(enrollment => enrollment.state === states[state]).length;
			const labels = {
				'cash_enrollment_state': states[state],
				'cash_product': 'BLACKSTAR RF',
				'cash_program': 'K+N UK Sellers',
			}
			gauge.set(labels, count);
		})
	}

	setInterval(countEnrollments, 5000);
};
