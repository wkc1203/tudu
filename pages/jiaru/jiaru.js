// pages/jiaru/jiaru.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teamName: "",
    touxiang:"",
    nicheng:"",
    groupId:"",
    isCount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options && options.teamName) {
      this.setData({
        teamName: options.teamName
      })
    }
    if (options && options.touxiang) {
      this.setData({
        touxiang: options.touxiang
      })
    }
    if (options && options.groupId) {
      this.setData({
        groupId: options.groupId
      })
    }
    if (options && options.nicheng) {
      this.setData({
        nicheng: options.nicheng
      })
    }
    console.log(777777)
    wx.login({
      success:res=> {
        console.log("login=",res)
      }
    })
    wx.getSetting({
      success:res => {
        console.log("res=",res)
      }
    })
  },
  // getUserInfo: function (e) {
  //   console.log("--",e)
  // },
  // 加入小组
  getUserInfo:function (e) {
    // console.log("99999999")
    console.log("eee=",e)
    // 获取用户信息
    var that=this
    // if (that.data.isCount>1) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '链接已失效',
    //   })
    //   return
    // }
    this.setData({
      isCount:that.data.isCount+1
    })
    // console.log("6666666")
    wx.getSetting({
      success: re => {
        console.log("youquanxian=",re)
        if (re.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              app.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              }
              wx.showToast({
                title: '',
              })

              // 授权手登陆
              wx.login({
                success: r=> {
                  wx.request({
                    url: app.globalData.server + '/login/',
                    data: {
                      nickName: res.userInfo.nickName,
                      city: res.userInfo.city,
                      country: res.userInfo.country,
                      avatarUrl: res.userInfo.avatarUrl,
                      code: r.code
                    },
                    method: "post",
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success(rest) {
                      console.log('dtt=', rest.data)
                      if (rest.data.code == 0) {
                        wx.setStorage({
                          key: 'loginUser',
                          data: rest.data.object,
                        })
                        //  登陆成功后
                        wx.request({
                          url: app.globalData.server + '/apply',
                          data: {
                            userId: rest.data.object.id,
                            groupId: that.data.groupId,
                            router: "ADD_GROUP"
                          },
                          header: {
                            "token": rest.data.object.token,
                            'content-type': 'application/x-www-form-urlencoded'
                          },
                          method: "post",
                          success(restt) {
                            wx.hideLoading()
                            if (restt.data.code == 0) {
                              console.log("dt=", restt.data)
                              wx.switchTab({
                                url: '/pages/team/team',
                              })
                            } else {
                              wx.showModal({
                                title: '提示',
                                content: '链接已失效',
                                showCancel: false
                              })
                            }
                          },
                          fail(err) {
                            wx.hideLoading()
                            wx.showModal({
                              title: '提示',
                              content: err.errMsg,
                              showCancel: false
                            })
                          }
                        })
                      }

                    },
                    fail(err) {
                      wx.hideLoading()
                      wx.showModal({
                        title: '提示',
                        content: err.errMsg,
                        showCancel: false
                      })
                    }
                  })
                },
                fail(err) {
                  wx.hideLoading()
                  wx.showModal({
                    title: '提示',
                    content: err.errMsg,
                    showCancel: false
                  })
                }
              })
              

            }
          })
        }else{
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '未获取到权限',
            showCancel: false
          })
        }
      },
      fail(re) {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: re.errMsg,
          showCancel: false
        })
        
      }
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})