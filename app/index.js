const express = require('express');
const cash = require('./cash');
const metrics = require('./metrics');

const app = express();
cash.run();

// Report Prometheus metrics on /metrics
app.get('/metrics', async (req, res, next) => {
	res.set('Content-Type', metrics.registry.contentType);
	res.end(await metrics.registry.metrics());
	next();
});

// Run the server
app.listen(9200, '0.0.0.0', () => console.log('App started!'));
