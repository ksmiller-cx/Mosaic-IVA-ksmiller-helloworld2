process.env.GCLOUD_PROJECT = process.env.PROJECT_ID;
if (process.env.K_SERVICE) {
    require('@google-cloud/trace-agent').start({
        projectId: process.env.PROJECT_ID,
    });
    require('@google-cloud/profiler').start({
        serviceContext: {
        service: 'feature-demo',
        version: '1.0.0',
        },
    });
}

const Koa = require('koa');

const port = process.env.PORT || 8081;
const app = new Koa();
require('@mosaic-cx/neuron').neuron(app);
app.listen(port);
