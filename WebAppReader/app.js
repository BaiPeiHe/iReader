
var koa = require('koa');
var controller = require('koa-route');
var app = koa();

var views = require('co-views');
var render = views('./view',{
    map : {html : 'ejs'}
});

var koa_static = require('koa-static-server');

var service = require('./service/webAppService.js');

// 访问静态文件
app.use(koa_static({
    // 静态文件的根目录
    rootDir : './static/',
    // url 的访问名称
    rootPath : '/static/',
    // 缓存周期 为不缓存
    maxage : 0
}));

// 发起一个 Get 或 Post 请求
app.use(controller.get('/route_test',function * () {
    // 设置 app 的返回头不缓存
    this.set('Cache-Control','no-cache');
    // 返回的 body 体
    this.body = 'Hello koa!';
}));

// 使用模板
app.use(controller.get('/ejs_test',function * () {
    // 设置 app 的返回头不缓存
    this.set('Cache-Control','no-cache');
    // 返回的 body 体
    this.body = yield render('test',{title:'title_test'});
}));

//
app.use(controller.get('/api_test',function * () {
    // 设置 app 的返回头不缓存
    this.set('Cache-Control','no-cache');

    this.body = service.get_test_data();
}));

// 异步搜索接口
app.use(controller.get('/ajax/search',function*() {
    this.set('Cache-Control','no-cache');
    var querystring = require("querystring");
    var param = querystring.parse(this.req._parsedUrl.query);
    var start  = param.start;
    var end = param.end;
    var keyword = param.keyword;
    this.body = yield service.get_search_data(start,end,keyword);
}));


// 监听的端口
app.listen(3001);
console.log('koa server is started!');