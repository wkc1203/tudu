// pages/creatFinish/creatFinish.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    teamName:"",
    memberNum:0,
    groupId:"",
    nicheng:"",
    touxiang:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if (options && options.teamName) {
      this.setData({
        teamName:options.teamName
      })
    }
    if (options && options.memberNum) {
      this.setData({
        memberNum:options.memberNum
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
    if (options && options.touxiang) {
      this.setData({
        touxiang: options.touxiang
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 分享后回调
  onShareAppMessage:function (res) {
    // console.log("9999999999999999")
    // console.log("r====",res)
    return {
      title:"凸度",
      path: `/pages/jiaru/jiaru?groupId=${this.data.groupId}&touxiang=${this.data.touxiang}&teamName=${this.data.teamName}&nicheng=${this.data.nicheng}`,
      imageUrl:""
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '创建成功',
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
  // onShareAppMessage: function () {

  // }
})