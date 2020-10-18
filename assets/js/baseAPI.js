//注意: 每次调用$.get或$.post或$.ajax 的时候,会先调用 ajaxPrefilter()这个函数,在这个函数中,我们可以拿到我们给Ajax提供的配置项

$.ajaxPrefilter(function (options) {
    // console.log(options.url);
    //在发起真正的Ajax请求之前,统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    //统一为有权限的接口，设置 headers 请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载complete 回调函数
    options.complete = function (res) {
        // console.log('zhixing complete');
        // console.log(res);
        //在complete 回调函数中，可以用 res.responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 清空 token
            localStorage.removeItem('token')
            // 强制跳转到登录页面
            location.href = '/login.html'
        }
    }
})