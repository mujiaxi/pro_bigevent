$(function(){
    var form = layui.form
    var layer = layui.layer
    form.verify({
        pwd: [/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],
        samePwd: function(value){
            if (value ===$('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        rePwd: function(value) {
            if ($('[name=newPwd]').val() !== value) {
                return '两次密码不一致'
            }
        }
    })


    //监听表单提交事件
    $('.layui-form').on('submit',function(e){
        //阻止表达默认提交
        e.preventDefault()
        //ajax 提交数据
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: {
                oldPwd: $('[name=oldPwd]').val(),
                newPwd: $('[name=newPwd]').val()
            },
            success: function(res) {
                if(res.status !== 0) return layer.msg('更新密码失败！')
                layer.msg('更新密码成功！')
                //重置表单
                $('.layui-form')[0].reset()
            }
            
        })
    })


})