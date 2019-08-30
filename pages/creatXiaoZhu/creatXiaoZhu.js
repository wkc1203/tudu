// pages/creatXiaoZhu/creatXiaoZhu.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否允许成员发布 1允许0不允许
    isMemberFabu:1,
    content:"",
    // 还可以创建的数量
    shengyuCreat:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("optin=",options)
    if (options && options.shengyuCreat) {
      this.setData({
        shengyuCreat: options.shengyuCreat
      })
    }
  },
  // 
  setContent:function (e) {
    console.log(e)
    if (e && e.detail) {
      this.setData({
        content:e.detail.value
      })
    }
  },
  // 允许成员发布
  changeFabu:function (e) {
    console.log(e)
    var that=this
    if (e.detail.value) {
      this.setData({
        isMemberFabu: 1
      })
    } else {
      this.setData({
        isMemberFabu:0
      })
    }
    
  },
  // 创建完成
  creatFinish: function () {
    var that=this
    if (!that.data.content) {
      wx.showToast({
        title: '请输入小组名称',
      })
    }
    // 获取access_token
    // wx.request({
    //   url: 'https://api.weixin.qq.com/cgi-bin/token',
    //   method: 'GET',
    //   data: {
    //     grant_type: 'client_credential',
    //     appid: 'wx946a1c0c331b0200',
    //     secret: 'a6cf9b5c2209174fc41b6634262a9281 '
    //   },
    //   success(res) {
    //     // 查询敏感字
    //     wx.request({
    //       url: 'https://api.weixin.qq.com/wxa/msg_sec_check?access_token='+res.data,
    //       method: 'POST',
    //       data: {
    //         content:that.data.content
    //       },
    //       success(ret) {
    //         // 有敏感字
    //         if (ret.errcode === 87014) {
    //           wx.showModal({
    //             title: '友情提示',
    //             content: '内容含有敏感字',
    //           })
    //         }else {
              // 无敏感字
              wx.getStorage({
                key: 'loginUser',
                success: function(resw) {
                  console.log('resw=',resw)
                  // 查询已经创建的数量
                  wx.showLoading({
                    title:"请求中"
                  })
                  wx.request({
                    url: app.globalData.server + '/apply',
                    data: {
                      router: "IS_CREATEGROUPMAX"
                    },
                    method: "post",
                    header: {
                      'token': resw.data.token,
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success(res1) {
                      console.log('res1=',res1)
                      // 已达到最大创建数量
                      if (res1.data.code == 0) {
                        if (res1.data.object <= 0) {
                          wx.hideLoading()
                          wx.showModal({
                            title: '提示',
                            content: '创建小组数量已达到最大限制\r\n[5/5]',
                            showCancel: false
                          })
                        } else {
                          //  开始创建
                          wx.request({
                            url: app.globalData.server + '/apply',
                            data: {
                              router: "CREATE_GROUP",
                              taskIspublished: that.data.isMemberFabu,
                              groupName: that.data.content
                            },
                            method: "post",
                            header: {
                              'token': resw.data.token,
                              'content-type': 'application/x-www-form-urlencoded'
                            },
                            success(re) {
                              wx.hideLoading()
                              // 创建成功
                              if (re.data.code == 0) {
                                wx.showModal({
                                  title: '提示',
                                  content: '创建成功',
                                  confirmText: "邀请成员",
                                  showCancel: false,
                                  success(res) {
                                    if (res.confirm) {
                                      // 创建成功之后跳转
                                      wx.getStorage({
                                        key: 'loginUser',
                                        success: function(res) {
                                          wx.navigateTo({
                                            url: '../../pages/creatFinish/creatFinish?teamName=' + that.data.content + '&memberNum=' + (10 - parseInt(re.data.object.groupMemberCount)) + "&groupId=" + re.data.object.id + "&nicheng=" + res.data.nickName + "&touxiang=" + res.data.headImg,
                                          })
                                        },
                                      })
                                      
                                    }
                                  }
                                })
                              }else{
                                wx.showModal({
                                  title: '提示',
                                  content: re.data.message,
                                  showCancel:false
                                })
                              }
                            }
                          })
                        }

                      } else {
                        wx.hideLoading()
                        wx.showToast({
                          title: '未知错误',
                        })
                      }
                    }
                  })
                  
                },
              })
              
              
    //         }
    //       }
    //     })
    //   }
    // })
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
    wx.setNavigationBarTitle({
      title: '创建小组',
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#FFFFFF',
    })
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