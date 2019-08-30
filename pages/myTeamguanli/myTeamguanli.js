// pages/myTeamguanli/myTeamguanli.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teamDetail:[],
    type:"",
    isYaoQin:2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("opt=",options)
    var _this=this
    if (options && options.type==1) {
      wx.getStorage({
        key: 'creatTeam',
        success: function (res) {
          console.log("res=",res.data)
          _this.setData({
            teamDetail:res.data,
            type:"创建者",
            isYaoQin:1
          })
        },
      })
      wx.setNavigationBarTitle({
        title: "创建的组",
      })
    }
    if (options && options.type == 2) {
      wx.getStorage({
        key: 'joinTeam',
        success: function (res) {
          _this.setData({
            teamDetail: res.data,
            type:"成员"
          })
        },
      })
      wx.setNavigationBarTitle({
        title: "加入的组",
        isYaoQin:2
      })
    }
  },
  // 管理团队
  guanliTeam:function (e){
    console.log("e=",e)
    if (e && e.currentTarget.dataset.itm) {
      wx.navigateTo({
        url: '../../pages/guanliTeam/guanliTeam?teamName=' + e.currentTarget.dataset.itm.groupName + "&teamId=" + e.currentTarget.dataset.itm.id +"&isYaoQin="+this.data.isYaoQin,
      })
    }
    
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