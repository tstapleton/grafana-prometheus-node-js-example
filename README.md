# Rollboard

## Run

```console
me@host:~/code$ git clone git@github.com:tstapleton/grafana-prometheus-node-js-example.git && cd grafana-prometheus-node-js-example
me@host:~/code/grafana-prometheus-node-js-example$ docker-compose up -d grafana prometheus
me@host:~/code/grafana-prometheus-node-js-example$ cd app
me@host:~/code/grafana-prometheus-node-js-example$ npm ci
me@host:~/code/grafana-prometheus-node-js-example$ npm run dev
```

Open http://localhost:3000 and login to Grafana using the credentials `admin:illchangeitanyway`. View raw metrics at http://localhost:9200/metrics. Console logs for the Node app shows what's happening in the program day by day.

## Credit

Full tutorial from the blog post: [https://sergeypotekhin.com/](http://sergeypotekhin.com/visualizing-data-from-the-node-js-app/?utm_source=github&utm_medium=readme&utm_campaign=repos).
