const metrics = require('./metrics');

const states = {
	completed: 'COMPLETED',
	draft: 'DRAFT',
	invited: 'INVITED',
	noaBuyer: 'NOA_BUYER',
	noaOps: 'NOA_OPS',
	rejected: 'REJECTED',
}
const stateOrder = [states.draft, states.invited, states.noaOps, states.noaBuyer, states.completed];

const product = 'BLACKSTAR RF';
const programs = ['K+N UK', 'NHS UK'];

const enrollments = [];
let day = 0;

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
				'cash_product': enrollment.product,
				'cash_program': enrollment.program,
			};
			const value = day - enrollment.modified;
			metrics.timeSpentPerEnrollmentStateHistogram.observe(labels, value);

			const index = stateOrder.findIndex(state => enrollment.state === state);
			enrollment.state = stateOrder[index + 1];
			enrollment.modified = day;

			console.log(`Marking enrollment ${enrollment.id} as ${enrollment.state} on ${enrollment.modified}`);

			if (enrollment.state === states.completed) {
				const value = day - enrollment.created;
				const { cash_product, cash_program } = labels;
				const completionLabels = { cash_product, cash_program };
				metrics.timeToCompleteEnrollmentGauge.set(completionLabels, value);
				console.log(`Enrollment ${enrollment.id} took ${value} days to complete`);
			}

			return;
		}
	})
	const newEnrollmentsToCreate = 3;
	Array.from(Array(newEnrollmentsToCreate), (v, i) => i).map(() => {
		const id = enrollments.length + 1;
		const state = states.draft;
		const created = day;
		const program = programs[Math.round(Math.random())];
		enrollments.push({ id, state, created, modified: created, product, program });
		console.log(`Creating enrollment ${id} as ${state} on ${created}`);
	})

	day = day + 1;
}

const countEnrollments = () => {
	programs.map((program) => {
		Object.keys(states).map((state) => {
			const count = enrollments.filter(enrollment => enrollment.state === states[state] && enrollment.program === program).length;
			const labels = {
				'cash_enrollment_state': states[state],
				'cash_product': product,
				'cash_program': program,
			}
			metrics.currentEnrollmentsCountGauge.set(labels, count);
		})
	})
}

module.exports = {
	run() {
		setInterval(runCashProgram, 4000);
		setInterval(countEnrollments, 5000);
	}
}
