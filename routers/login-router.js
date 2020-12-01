/*
  拆解独立的路由模块
*/
const express = require('express')
const router = express.Router()
const path = require("path")
const utility = require("utility")
// 导入数据库通用模块
const db = require(path.join(__dirname, "../common.js"))

// 注册接口
router.post("/reguser", async (req, res) => {
  // 1.获取表单数据
  var parmas = req.body
  // 将密码做加密处理
  parmas.password = utility.md5(parmas.password)

  // 在加入mysql数据库前做验证，用户名是否已经存在，若存在，结束
  var csql = "select id from user_login where username=?"
  let flag = await db.operateDb(csql, parmas.username)
  if (flag && flag.length > 0) {
    // 用户名已经存在
    res.json({
      status: 1,
      message: '用户名已经存在'
    })
    return
  }


  // 将数据添加到数据库
  let sql = "insert into user_login set ?"
  let ret = await db.operateDb(sql, parmas)
  // 判断获取的数据是否为空数组，如果是注册失败,还要判断是否为null
  if (ret && ret.affectedRows > 0) {
    res.json({
      status: 0,
      message: "注册成功"
    })
  } else {
    res.json({
      status: 1,
      message: "注册失败"
    })
  }
})




// 测试
// router.get('/abc', async (req, res) => {
//   var sql = "select * from myuser"
//   var ret = await db.operateDb(sql, null)

//   if (ret && ret.length > 0) {
//     res.json({
//       stutas: 0,
//       message: "查询数据成功",
//       data: ret,
//     })
//   }
//   else {
//     res.json({
//       stutas: 1,
//       message: "查询数据失败",
//     })
//   }
// })

module.exports = router

//
// const express = require("express")
// const router = express.Router()

// router.get("/data", (res, req) => {
//   res.send("get")
// })

// module.exports = router