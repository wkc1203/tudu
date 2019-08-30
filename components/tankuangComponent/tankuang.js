const app = getApp()
Component({
  properties: {
    chengyuantouxiang: {
      type: String,
      value: ""
    },
    nicheng: {
      type: String,
      value: ""
    },
    guanlianNum: {
      type: Number,
      value: 0
    },
    groupId: {
      type:Number,
      value:0
    },
    userId: {
      type:Number,
      value:0
    },
    teamName: {
      type:String,
      value:""
    },
    coazuoType: {
      type:Number,
      // 1修改 2 删除 3解散小组 4修改小组名称
      value:0
    }
  },
  data: {
    showModal: false,
    inputValue:"",
  },
  methods: {
    setInputValue:function (e) {
      this.setData({
        inputValue:e.detail.value
      })
    },
    btn: function () {
      this.setData({
        showModal: true
      })
    },
    cancel: function () {
      this.setData({
        showModal: false
      })
    },
    confirm: function () {
      if (!this.data.inputValue) {
        wx.showToast({
          title: '请输入内容',
        })
        return
      }
      var that=this
      // 修改备注名称
      wx.getStorage({
        key: 'loginUser',
        success: function (res) {
          wx.showLoading({
            title: '修改中',
            mask: true
          })
          wx.request({
            url: app.globalData.server + '/apply',
            data: {
              router: "EDIT_MEMBERNAME",
              userId: that.data.userId,
              groupId: that.data.groupId,
              memberName: that.data.inputValue
            },
            method: "post",
            header: {
              "token": res.data.token,
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(re) {
              wx.hideLoading()
              if (re.data.code!=0) {
                wx.showModal({
                  title: '提示',
                  content: re.data.message,
                  showCancel: false
                })
              }
              that.setData({
                showModal: false
              })
              const pages = getCurrentPages()
              const perpage = pages[pages.length - 1]
              perpage.getMemberList(that.properties.groupId)
              const preperpage = pages[pages.length - 2]
              preperpage.getMemberList(that.properties.groupId)

            },
            fail(err) {
              wx.hideLoading()
              wx.showToast({
                title: err.errMsg,
              })
            }
          })
          wx.hideLoading()
        },
      })
    },
    // 修改小组名称
    xiugaiTeamName:function () {
      if (!this.data.inputValue) {
        wx.showToast({
          title: '请输入内容',
        })
        return
      }
      var that = this
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
      //       url: 'https://api.weixin.qq.com/wxa/msg_sec_check?access_token=' + res.data,
      //       method: 'POST',
      //       data: {
      //         content: that.data.inputValue
      //       },
      //       success(ret) {
      //         // 有敏感字
      //         if (ret.errcode === 87014) {
      //           wx.showModal({
      //             title: '友情提示',
      //             content: '内容含有敏感字',
      //           })
      //           return
      //         } else {
                // 无敏感字
                wx.getStorage({
                  key: 'loginUser',
                  success: function (res) {
                    wx.showLoading({
                      title: '修改中',
                      mask:true
                    })
                    wx.request({
                      url: app.globalData.server + '/apply',
                      data: {
                        router: "EDIT_GROUPNAME",
                        groupId:that.data.groupId,
                        groupName: that.data.inputValue
                      },
                      method: "post",
                      header: {
                        "token": res.data.token,
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      success(re) {
                        wx.hideLoading()
                        if (re.data.code!=0) {
                          wx.showModal({
                            title: '提示',
                            content: re.data.message,
                            showCancel:false
                          })
                        }
                        that.setData({
                          showModal: false
                        })
                        const pages = getCurrentPages()
                        const perpage = pages[pages.length - 1]
                        const preperpage=pages[pages.length-2]
                        // preperpage.getMemberList(that.properties.groupId)
                        perpage.setData({
                          deleRefer: true,
                          teamName: re.data.object.groupName
                        })
                        preperpage.setData({
                          teamName: re.data.object.groupName
                        })
                      },
                      fail(err) {
                        wx.hideLoading()
                        wx.showToast({
                          title: err.errMsg,
                        })
                      }
                    })
                  }
                })
              // }
            // }
          // })
        // }
      // })  
    },
    // 删除人员 解散小组
    deleteMember:function () {
      var that=this
      wx.getStorage({
        key: 'loginUser',
        success: function(res) {
          wx.showLoading({
            title: '删除中',
            mask:true
          })
          wx.request({
            url: app.globalData.server + '/apply',
            data: {
              router: "EXT_GROUP",
              userId: that.data.userId,
              groupId: that.data.groupId,
            },
            method: "post",
            header: {
              "token": res.data.token,
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(re) {
              wx.hideLoading()
              if (re.data.code != 0) {
                wx.showModal({
                  title: '提示',
                  content: re.data.message,
                  showCancel: false
                })
              }
              that.setData({
                showModal: false
              })
              if (that.properties.coazuoType==3) {
                wx.navigateBack({
                  delta: 2
                })
              }
              
              const pages = getCurrentPages()
              const perpage = pages[pages.length - 1]
              perpage.getMemberList(that.properties.groupId)
              const preperpage = pages[pages.length - 2]
              preperpage.getMemberList(that.properties.groupId)
              // perpage.setData({
              //   deleRefer: true
              // })
            },
            fail(err) {
              wx.hideLoading()
            }
          })
          wx.hideLoading()
        },
      })
    },
    // 禁止屏幕滚动
    preventTouchMove: function () {

    }
  }
})
