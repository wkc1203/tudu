//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log('userinfo=',res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
        // if (res.authSetting['scope.userLocation']) {
        //   wx.getLocation()
        //   wx.chooseLocation()
        // }
      }
    })
    // 隐藏系统tabBar
    this.hidetabbar()
    // 获取设备信息
    this.getSystemInfo()
    
  },
  editTabbar: function () {
    let tabbar = this.globalData.tabBar;
    console.log('tabbar=',tabbar)
    let currentPages = getCurrentPages();
    console.log('currentPages=',currentPages)
    let _this = currentPages[currentPages.length - 1];
    console.log('_this=',_this)
    let pagePath = _this.route;
    // console.log('pagePath=',pagePath)
    // console.log('tabbar.list=', tabbar.list)
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
  globalData: {
    userInfo: null,
    systemInfo: null,
    // server: "http://192.168.2.6:8077/api/user",
    // server:"http://113.204.140.166:58077/api/user",
    // 线上
    server:"https://todooo.cn/api/user",
    tabBar: {
      "backgroundColor": "#ffffff",
      "color": "#979795",
      "selectedColor": "#1c1c1b",
      "list": [
        {
          "pagePath": "/pages/index/index",
          "iconPath": "icon/icon_home.png",
          "selectedIconPath": "icon/icon_home_HL.png",
          "text": ""
        },
        {
          "pagePath": "/pages/sendSay/sendSay",
          "iconPath": "icon /icon_release.png",
          "isSpecial": true,
          "text": ""
        },
        {
          "pagePath": "/pages/team/team",
          "iconPath": "icon/icon_mine.png",
          "selectedIconPath": "icon/icon_mine_HL.png",
          "text": ""
        }
      ]

    }
  },
  hidetabbar() {
    wx.hideTabBar({
      fail: function () {
        setTimeout(function () { // 做了个延时重试一次，作为保底。
          wx.hideTabBar()
        }, 500)
      }
    });
  },
  getSystemInfo: function () {
    let t = this;
    wx.getSystemInfo({
      success: function (res) {
        t.globalData.systemInfo = res;
      }
    });
  },
  // formID
  setFormId: function (formID) {
    wx.getStorage({
      key: 'loginUser',
      success: function (res) {
        // formId
        wx.request({
          url: app.globalData.server + '/apply',
          data: {
            formIds: formID,
            router: "SAVE_FORMIDS"
          },
          method: "post",
          header: {
            "token": res.data.token,
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(re) {
            console.log("re=", re)
          }
        })
      },
    })
  },
})
