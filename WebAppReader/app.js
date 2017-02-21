
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


// 首页 UI
app.use(controller.get('/',function * () {
    // 设置 app 的返回头不缓存
    this.set('Cache-Control','no-cache');
    this.body = yield render('index',{title:'书城首页'});
}));

// 搜索页面 UI
app.use(controller.get('/search',function * () {
    // 设置 app 的返回头不缓存
    this.set('Cache-Control','no-cache');
    this.body = yield render('search',{title:'搜索页面'});
}));

// 书籍详情页面 UI
var querystring = require('querystring');
app.use(controller.get('/book',function * () {
    // 设置 app 的返回头不缓存
    this.set('Cache-Control','no-cache');
    var params = querystring.parse(this.req._parsedUrl.query);
    var bookId  = params.id;
    this.body = yield render('book',{bookId:bookId});
}));

// 分类页面 UI
app.use(controller.get('/category',function * () {
    // 设置 app 的返回头不缓存
    this.set('Cache-Control','no-cache');
    this.body = yield render('category',{title:'分类页面'});
}));

// 女生页面 UI
app.use(controller.get('/female',function * () {
    // 设置 app 的返回头不缓存
    this.set('Cache-Control','no-cache');
    this.body = yield render('female',{title:'女生页面'});
}));

// 男生页面 UI
app.use(controller.get('/male',function * () {
    // 设置 app 的返回头不缓存
    this.set('Cache-Control','no-cache');
    this.body = yield render('male',{title:'男生页面'});
}));

// 排行页面 UI
app.use(controller.get('/rank',function * () {
    // 设置 app 的返回头不缓存
    this.set('Cache-Control','no-cache');
    this.body = yield render('rank',{title:'排行页面'});
}));



// Http 搜索接口
app.use(controller.get('/ajax/search',function*() {
    this.set('Cache-Control','no-cache');
    var querystring = require("querystring");
    var param = querystring.parse(this.req._parsedUrl.query);
    var start  = param.start;
    var end = param.end;
    var keyword = param.keyword;
    this.body = yield service.get_search_data(start,end,keyword);
}));

// mock 首页接口
app.use(controller.get('/ajax/home',function*() {
    this.set('Cache-Control','no-cache');

    this.body = service.get_home_data();
}));

// mock 书籍接口
var querystring = require('querystring');
app.use(controller.get('/ajax/book',function*() {
    this.set('Cache-Control','no-cache');
    var params = querystring.parse(this.req._parsedUrl.query);
    var id = params.id;
    if(!id){
        id = "";
    }
    this.body = service.get_book_data(id);
}));

// mock 测试
app.use(controller.get('/api_test',function * () {
    // 设置 app 的返回头不缓存
    this.set('Cache-Control','no-cache');
    this.body = service.get_test_data();
}));


// 监听的端口
app.listen(3000);
console.log('koa server is started!');