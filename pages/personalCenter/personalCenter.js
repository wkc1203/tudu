// pages/personalCenter/personalCenter.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dakai:"打卡",
    chuangjianNum:0,
    jiaruNum:0,
    // 是否打卡
    isChekIn:0,
    // 创建的小组
    creatTeam:[],
    // 加入的小组
    joinTeam:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '',
      mask: true
    })
    // 创建的小组
    this.getCreatTeam(1)
    // 加入的小组
    this.getCreatTeam(2)
    wx.hideLoading()
  },
  // 获取组
  getCreatTeam: function (type) {
    var _this = this
    wx.getStorage({
      key: 'loginUser',
      success: function (res) {
        wx.showLoading({
          title: '数据获取中',
          mask: true
        })
        console.log("res=", res.data.isChekIn)
        if (res.data && res.data.isChekIn=="1") {
          _this.setData({
            dakai: "已打卡",
            isChekIn:1
          })
        }
        wx.getStorage({
          key: 'isChekIn',
          success: function (res) {
            _this.setData({
              dakai: "已打卡"
            })
          },
        })

        wx.request({
          url: app.globalData.server + '/apply',
          data: {
            router: "GET_GROUPS",
            memberType: type
          },
          method: "post",
          header: {
            "token": res.data.token,
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(rest) {
            console.log("xilist=", res)
            if (rest.data.code == 0 && rest.data.object.length > 0) {
              if (type==1) {
                _this.setData({
                  chuangjianNum: rest.data.object.length
                })
                wx.setStorage({
                  key: 'creatTeam',
                  data: rest.data.object,
                })
              }
              if (type==2) {
                _this.setData({
                  jiaruNum: rest.data.object.length
                })
                wx.setStorage({
                  key: 'joinTeam',
                  data: rest.data.object,
                })
              }
            }
            wx.hideLoading()
          },
          fail(err) {
            wx.hideLoading()
            wx.showToast({
              title: err.errMsg,
            })
          }
        })
      },
    })

  },
  // 打卡
  dakai:function () {
    var _this=this
    if (_this.data.dakai == "已打卡") {
      return
    }
    wx.getStorage({
      key: 'loginUser',
      success: function(res) {
        wx.showLoading({
          title: '数据获取中',
          mask: true
        })
        wx.request({
          url: app.globalData.server + '/apply',
          data:{
            router:"CHECK_IN"
          },
          method:"post",
          header:{
            "token":res.data.token,
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            wx.hideLoading()
            // console.log("d=",res.data)
            
            if (res.data.code==0) {
              _this.setData({
                dakai: "已打卡",
                isChekIn:1
              })
              wx.setStorage({
                key: 'isChekIn',
                data: res.data.object.isChekIn,
              })
            }else{
              wx.showToast({
                title: '打开失败',
              })
            }
          }
        })
      },
    })
    
  },
  // 创建的组
  chuangjianTeam:function () {
    wx.navigateTo({
      url: '../../pages/myTeamguanli/myTeamguanli?type=1',
    })
  },
  // 加入的组
  jiaruTeam:function () {
    wx.navigateTo({
      url: '../../pages/myTeamguanli/myTeamguanli?type=2',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '我的凸度',
    })
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