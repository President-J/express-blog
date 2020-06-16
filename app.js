var express = require('express')
var router = require('./router.js')
var path = require('path')
var bodyParser = require('body-parser')
var session = require('express-session')
var app = express()
app.use('/public/',express.static(path.join(__dirname,'./public/')))
app.use('/node_modules/',express.static(path.join(__dirname,'./node_modules/')))
app.engine('html',require('express-art-template'))
app.set('views',path.join(__dirname,'./views'))//默认是views。这行代码可以和省略方便修改 
// 中间件一定要在路由挂载之前
//在Epress中不支持session和cookie，需要借助中间件
app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:true
}))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(router)
app.listen(5000,function(){
    console.log('runing...')
})
