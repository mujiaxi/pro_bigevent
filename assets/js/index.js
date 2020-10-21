$(function () {

    //调用getUserInfo() 获取用户基本信息

    getUserInfo()
    // 点击按钮实现退出功能
    var layer = layui.layer
    $('#btnlogout').on('click', function () {
        // console.log('ok');
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //    console.log('ok');
            // 1. 清空本地存储
            localStorage.removeItem('token');
            // 2. 重新跳转到登录页面
            location.href = '/login.html';

            //关闭 confirm 询问框
            layer.close(index);
        });
    })








})
//获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 就是请求头配置对象
        //  headers: {
        //     Authorization: localStorage.getItem('token') || ''
        //  },
        //baseApi 引入
        success: function (res) {
            //  console.log(res);
            if (res.status !== 0) return layer.msg('获取用户信息失败')
            //调用 renderAvatar 渲染用户头像
            renderAvatar(res.data)
        },
        //无论请求失败还是成功，最终都会调用 complete 回调函数
        // complete: function(res) {
        //     // console.log('zhixing complete');
        //     // console.log(res);
        //     //在complete 回调函数中，可以用 res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
        //         // 清空 token
        //         localStorage.removeItem('token')
        //         // 强制跳转到登录页面
        //         location.href= '/login.html'
        //     }
        // }
    })
}

//渲染用户头像
function renderAvatar(user) {
    //获取用户名称
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    //按需渲染用户的头像
    if (user.user_pic !== null) {
        //渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        //渲染文本头像
        var str = name[0].toUpperCase();
        $('.layui-nav-img').hide();
        $('.text-avatar').html(str).show();
    }
}
