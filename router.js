var express = require('express')
var User = require('./models/user')
var md5 = require('blueimp-md5')
var router = express.Router()
router.get('/', function (req, res) {
    console.log(req.session.user)
    res.render('index.html', {
        user: req.session.user
    })
})
router.get('/login', function (req, res) {

    res.render('login.html')
})
router.post('/login', function (req, res) {
    var body = req.body
    User.findOne({
        email: body.email,
        password: md5(md5(body.password))
    }, function (err, user) {
        if (err) {
            return res.status(500).json({
                err_code: 500,
                // err自带一个属性
                message: err.message
            })
        }
        if (!user) {
            return res.status(200).json({
                err_code: 1,
                message: 'Email or password is invalid'
            })
        }
        //用户存在，登录成功，通过session记录登录状态
        req.session.user = user
        res.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
})
router.get('/register', function (req, res) {
    res.render('register.html')

})
router.post('/register', function (req, res) {
    var body = req.body

    User.findOne({
        //    或者关系
        $or: [
            {
                email: body.email
            },
            {
                nickname: body.nickname
            }
        ]
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                success: true,
                message: '服务端错误'

            })
        }
        if (data) {
            return res.status(200).json({
                err_code: 1,
                message: "邮箱或者昵称已存在"

            })
        }
        //接受保存客户端提交的数据
        body.password = md5(md5(body.password))
        new User(body).save(function (err, user) {
            if (err) {
                return res.status(500).json({
                    err_code: 500,
                    message: '服务端错误'
                })
            }
            //注册成功，使用session记录用户的登录状态
            req.session.user = user
            //服务端返回的类型不是json类型，客户端接收不到,所以需要转换成json类型
            // res.status(200).send(JSON.stringify({
            //     success:true
            // }))
            //Express提供了一个方法：json
            res.status(200).json({
                err_code: 0,
                success: true

            })




        })

    })
})
router.get('/logout', function (req, res) {
    //清楚登录状态
    req.session.user = null
    //重定向到登录页
    //a链接默认是同步请求，可以用服务端重定向
    res.redirect('/login')
})
module.exports = router