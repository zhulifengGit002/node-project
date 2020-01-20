const express = require("express");
const bodyParser = require("body-parser");
//const cors = require('cors') // 解决跨域
const path = require('path')

const db = require('./db/db');
const app = express();

//创建application/x-www-form-urlencoded编码解析
const urlencodedParser = bodyParser.urlencoded({ extended: false });
//app.use(cors())
//app.use(bodyParser.json())

//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
//用户注册
app.post('/register', urlencodedParser, function (req, res) {
  var userName = req.body.userName;
  var pwd = req.body.pwd;
  if (!userName) {
      res.json({ code: -1, message: '用户名不能为空' });
  } else if (!pwd) {
      res.json({ code: -1, message: '密码不能为空' });
  } else {
      //存储到数据库
      db.searchUser({ name: userName }, function (result) {
        if (result.length > 0 && result[0].name == userName) {
            res.json({ code: -1, message: '用户已存在，可直接登录' });
        } else {
            // res.json({ code: -1, message: '不存在该用户' });
            db.insertUser({ name: userName, pwd: pwd }, function (insertResult) {
                console.log(insertResult)
                if (insertResult.insertedCount > 0) {
                    res.json({ code: 0, message: '注册成功' });
                } else {
                    res.json({ code: -1, message: '注册失败，请重新注册' });
                }
            })
        }
    });
  }
})

//用户登录
app.post('/login', urlencodedParser, function (req, res) {
  var userName = req.body.userName;
  var pwd = req.body.pwd; 
  if (!userName) {
      res.json({ code: -1, message: '用户名不能为空' });
  } else if (!pwd) {
      res.json({ code: -1, message: '密码不能为空' });
  } else {
      db.searchUser({ name: userName }, function (result) {
          if (result.length > 0) {
              if (result[0].name == userName && result[0].pwd == pwd) {
                  res.json({ code: 0, message: '登录成功' }); 
              } else {
                  res.json({ code: -1, message: '用户名或密码错误' });
              }
          } else {
              res.json({ code: -1, message: '不存在该用户' });
          }
      });
  }
})

//添加博客文章
app.post('/blog/addPost', urlencodedParser, function(req, res){
    var postTitle = req.body.title||'';
    var postSort = req.body.sort||'';
    var postLabel = req.body.label||'';
    var postContent = req.body.content||'';
    var postDate =  new Date().getTime();
    if (!postTitle) {
        res.json({ code: -1, message: '文章标题不能为空' });
    } else if (!postContent) {
        res.json({ code: -1, message: '文章内容不能为空' });
    } else {
        db.insertBlogPost({ tltle: postTitle,  sort:postSort, label:postLabel, content:postContent, timestamp:postDate}, function (insertResult) {
            console.log(insertResult)
                if (insertResult.insertedCount > 0) {
                    res.json({ code: 0, message: '添加成功' });
                } else {
                    res.json({ code: -1, message: '添加失败' });
                }
        });
    }
})

//查询博客文章
app.post('/blog/searchPost', urlencodedParser, function (req, res) {
    db.searchBlogPost({}, function (result) {
        if (result.length > 0) {
            res.json({ code: 0, message: result });
        } else {
            res.json({ code: -1, message: '未查询到' });
        }
    });
  })
const server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})