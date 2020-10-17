$(function () {
    //点击去注册账号链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    //点击去登录账号链接
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })


    //从layui中获取form对象
    var form = layui.form
    //从layui中获取layer对象 弹出提示框
    var layer = layui.layer
    //通过form.verify() 函数自定义校验规则
    form.verify({
        // 自定义一个pwd的密码校验
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            //通过形参拿到的是确认密码框的值
            //还需要拿到密码框的值
            //然后进行一次等于比较
            //如果判断失败,则return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致';
            }
        }
    })

    //监听注册表单提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name = password]').val() }
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);;
            }
            layer.msg('注册成功')
            //模拟人的点击行为
            $('#link_login').click()

        })
    })
    //监听登录表单提交事件
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        //快速获取表单数据
        var data = $(this).serialize()
        $.post('/api/login', data, function (res) {
            if (res.status !== 0) {
                return layer.msg('登录失败');
            }
            layer.msg('登录成功')
            // 将登录成功得到的token 字符串,保存到 localStorage中
            localStorage.setItem('token',res.token)
            // 跳转到后台主页
            location.href = '/index.html';
        })

    })

})