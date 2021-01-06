const client = require('prom-client');
const registry = new client.Registry();

const currentEnrollmentsCountGauge = new client.Gauge({
	name: 'cash_current_enrollments_count',
	help: 'Count of enrollments per state right now',
	registers: [registry],
	labelNames: [
		'cash_enrollment_state',
		'cash_product',
		'cash_program',
	],
});

const timeSpentPerEnrollmentStateHistogram = new client.Histogram({
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

const timeToCompleteEnrollmentGauge = new client.Gauge({
	name: 'cash_time_to_complete_enrollment_in_days',
	help: 'Number of days to complete enrollment from draft',
	registers: [registry],
	labelNames: [
		'cash_enrollment_state',
		'cash_product',
		'cash_program',
	]
})

module.exports = {
	registry,
	currentEnrollmentsCountGauge,
	timeSpentPerEnrollmentStateHistogram,
	timeToCompleteEnrollmentGauge,
};
