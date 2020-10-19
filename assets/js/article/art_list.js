$(function () {
    var form = layui.form
    var layer = layui.layer
    var laypage = layui.laypage
    //定义一个美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        // m = m > 9 ? m : '0' + m
        var d = padZero(dt.getDate())
        // d = d > 9 ? d : '0' + d


        var hh = padZero(dt.getHours())
        // hh = hh > 9 ? hh : '0' + hh
        var mm = padZero(dt.getMinutes())
        // mm = mm > 9 ? mm : '0' + mm
        var ss = padZero(dt.getSeconds())
        // ss = ss > 9 ? ss : '0' + ss
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    //定义一个补零的hanshu
    function padZero(n) {
        return n = n > 9 ? n : '0' + n
    }
    //定义一个查询的参数对象，将来请求数据的时候，需要将参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值,默认请求第一页的数据
        pagesize: 2, //每页显示多少条数据,默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '', // 文章的状态，可选值有：已发布、草稿
    }
    initTable()
    initCate()

    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // console.log(res);
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-tb', res)
                $('tbody').html(htmlStr)
                //调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }
    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取文章分类列表失败！')
                var htmlstr = template('tpl-cata', res)
                // console.log(htmlstr);
                $('[name=cate_id]').html(htmlstr)
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }
    //监听 form-search 的submit提交事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        //获取表单选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        //为查询对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        //根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })
    //定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        //用laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的id 注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //	每页显示的条数。laypage将会借助 count 和 limit 计算出分页数
            curr: q.pagenum, // 设置默认被选中的分页
            limits: [2, 3, 5, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 分页发生切换时，触发 jump回调
            //触发 jump 的两种方式
            // 1. 点击页码会触发
            // 2. 只要调用了  laypage.render() ，就会触发
            // 可以通过 first 的值来判断是通过哪种方式触发jump，first 打印的是布尔值，first为true是通过 laypage.render() 触发的，否则就是 点击页码 触发 jump
            jump: function (obj, first) {
                // console.log(first);
                // console.log(obj.curr);
                //把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                //把最新的条目数赋值给q这个查询参数对象中
                q.pagesize = obj.limit
                // 根据最新的q 获取对应的数据列表，并渲染表格
                if (!first) {
                    initTable()

                }
            }
        });
    }
    //通过代理方式给删除按钮添加点击事件
    $('body').on('click', '.btn-delete', function () {
        //获取删除按钮的个数
        var len = $('.btn-delete').length
        // console.log('ok')
        //获取要删除文章的id
        var id = $(this).attr('data-id')
        // 询问用户是否删除数据

        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) return layer.msg('删除失败！')
                    layer.msg('删除成功！')
                    //当数据删除完成后，需要判断当前页面中，是否还有剩余的数据，如果没有剩余的数据，则让页码值-1，在重新调用initTable()方法
                    if (len === 1) {
                        //如果 len 的值等于1，证明删除之后，页面上就没有任何数据
                        //页码最小值必须是1
                        q.pagesize === 1 ? 1 : q.pagesize - 1
                    }
                    initTable()
                }
            })

            layer.close(index);
        });
    })
})