const Koa = require('koa');
const Router = require('@koa/router');

const authService = require('./services/authService');
const ehrAccessService = require('./services/ehrAccessService');
const app = new Koa();
const router = new Router();
const api = new Router();

app.use(require('koa-static')('./app/build', {}));
app.use(require('koa-bodyparser')());

api.post('/login', async ctx => {
    authService.refreshToken = ctx.request.body.token;
    await authService.refresh();
    ctx.body = JSON.stringify({
        login: true, 
        ehrUrls: ehrAccessService.getLoginUrls()
    });
});

router.use('/api', api.routes());
router.get('/callback', async (ctx, next) => {
    ctx.redirect('/');
})

app.use(router.routes());

app.listen(8000);