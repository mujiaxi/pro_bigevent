$(function(){
    //点击去注册账号链接
    $('#link_reg').on('click',function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })
    //点击去登录账号链接
    $('#link_login').on('click',function(){
        $('.login-box').show()
        $('.reg-box').hide()
    })


    //从layui中获取form对象
    var form = layui.form
    //通过form.verify() 函数自定义校验规则
    form.verify({
        // 自定义一个pwd的密码校验
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ],
          repwd: function(value){
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



})