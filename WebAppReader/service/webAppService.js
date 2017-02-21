
var fs = require('fs');

// Mock 测试
exports.get_test_data = function () {
    var content = fs.readFileSync('./mock/test.json','utf-8');
    return content;
}

// Mock 首页接口
exports.get_home_data = function () {
    var content = fs.readFileSync('./mock/home.json','utf-8');
    return content;
}

// Mock 书籍
exports.get_book_data = function (book_id) {
    if(!book_id){
        book_id = "18218";
    }
    var content = fs.readFileSync('./mock/book/' + book_id + '.json','utf-8');
    return content;

}


// Http 搜索接口
exports.get_search_data = function (start,end,keyword) {
    return function (cb) {
        var http = require('http');
        var qs = require("querystring");
        var data = {
            s : keyword,
            start : start,
            end : end
        }
        // 将字典转换为 url 中的请求格式
        var content = qs.stringify(data);
        var http_request = {
            httpname : 'dushu.xiaomi.com',
            port : 80,
            path : '/store/v0/lib/query/onbox?' + content
        }

        var request_obj = http.request(http_request, function (_respose) {

            var respose_content = '';
            // 返回的编码
            _respose.setEncoding('utf8');

            // 返回的一部分
            _respose.on('data', function (chunk) {
                respose_content += chunk;
            });
            // 结束，返回数据
            _respose.on('end', function () {
                // 参数1：错误代码，参数2：返回的内容
                cb('Error', respose_content);
            });

        });
        // 响应出错
        request_obj.on('error',function () {

        });

        // 结束编写，触发请求
        request_obj.end();

    }
}