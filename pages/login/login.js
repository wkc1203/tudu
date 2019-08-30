//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this
    wx.login({
      success(res) {
        console.log('rest=',res)
        if (res) {
          var codet = res.code
          console.log('codet=',codet)
          wx.setStorage({
            key: 'code',
            data: codet,
          })
          // wx.getUserInfo({
          //   success: res => {
          //     var userInfo = res.userInfo
          //     console.log('use=', userInfo)
          //     var nickName = userInfo.nickName
          //     var avatarUrl = userInfo.avatarUrl
          //     var province = userInfo.province
          //     var city = userInfo.city
          //     var country = userInfo.country
          //     that.doLogin(nickName, city, country, avatarUrl, codet)
          //   }
          // })

        }
      }
    })
    

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  doLogin: function (nickName, city, country, avatarUrl, code) {
    // wx.switchTab({
    //   url: '../index/index'
    // })
    wx.showLoading({
      title: '登陆中',
      mask:true
    })
    wx.request({
      url: app.globalData.server+"/login/",
      data: {
        nickName: nickName,
        city: city,
        country: country,
        avatarUrl: avatarUrl,
        code: code
      },
      method:"post",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        wx.hideLoading()
        console.log('dtt=',res.data)
        if (res.data.code == 0) {
          wx.setStorage({
            key: 'loginUser',
            data: res.data.object,
          })
          wx.switchTab({
            url: '../index/index'
          })
        }
        
      },
      fail(err) {
        wx.hideLoading()
      }
    })
  },
  login: function () {
    var that=this
    wx.getUserInfo({
      success: res => {
        var userInfo = res.userInfo
        console.log('use=', userInfo)
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
        wx.getStorage({
          key: 'code',
          success: function(res) {
            that.doLogin(nickName, city, country, avatarUrl,res.data)
          },
        })
        
      }
    })
  },
  getUserInfo: function(e) {
    
    app.globalData.userInfo = e.detail.userInfo
    console.log('e=', e.detail)
    if (e) {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      this.login()
    }
    // app.setFormId
    // wx.switchTab({
    //   url: '../index/index'
    // })
  }
})
