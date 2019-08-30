// pages/guanlian/guanlian.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:"",
    nicheng:"",
    myUnFinish:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("op=",options)
    if (options && options.nicheng) {
      wx.setNavigationBarTitle({
        title: '与'.concat(options.nicheng,"的关联事情"),
      })
    }
    if (options && options.memberId) {
      this.guanlian(options.memberId)
    }
  },
  // 关联事件
  guanlian: function (userId) {
    var that=this
    wx.getStorage({
      key: 'loginUser',
      success: function (res) {
        wx.request({
          url: app.globalData.server + '/apply',
          data: {
            router: "A_CONNECT_B",
            userId: userId
          },
          method: "post",
          header: {
            "token": res.data.token,
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            if (res.data.code == 0) {
              console.log(res.data.object)
              that.setData({
                myUnFinish:res.data.object
              })
            }
          }
        })
      },
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