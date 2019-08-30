// pages/teamAllMember/teamAllMember.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberNum: 0,
    teamName:"",
    teamId:0,
    // 小组成员
    memberList: [],
    chengyuantouxiang: "",
    nicheng: "",
    guanlianNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options && options.teamId) {
      this.getMemberList(options.teamId)
      this.setData({
        teamId: options.teamId
      })
      // this.getTeamList(options.teamId)
    }
    if (options && options.teamName) {
      this.setData({
        teamName: options.teamName
      })
    } 
    
  },
  // 获取小组列表
  // getTeamList: function (teamId) {
  //   var _this = this
  //   wx.getStorage({
  //     key: 'loginUser',
  //     success: function (res) {
  //       wx.request({
  //         url: app.globalData.server + '/apply',
  //         data: {
  //           router: "GET_GROUPS",
  //           memberType: ""
  //         },
  //         method: "post",
  //         header: {
  //           "token": res.data.token,
  //           'content-type': 'application/x-www-form-urlencoded'
  //         },
  //         success(rest) {
  //           var arrayList = []
  //           if (rest.data.code == 0 && rest.data.object.length > 0) {
  //             for (var i = 0; i < rest.data.object.length; i++) {
  //               var obj = {}
  //               obj.id = rest.data.object[i].id
  //               if (rest.data.object[i].id == teamId) {
  //                 _this.setData({
  //                   teamName: rest.data.object[i].groupName
  //                 })
  //               }
  //             }
  //           }

  //         }
  //       })
  //     },
  //   })
  // },
  // 获取团队人员
  getMemberList: function (teamId) {
    var _this = this
    wx.getStorage({
      key: 'loginUser',
      success: function (res) {
        wx.request({
          url: app.globalData.server + '/apply',
          data: {
            router: "PUSH_TASK_BUT",
            groupId: teamId,
          },
          method: "post",
          header: {
            "token": res.data.token,
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            if (res.data.code == 0) {
              _this.setData({
                memberList: res.data.object,
                memberNum: res.data.object.length
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
    this.alert = this.selectComponent('#myComponent')
  },
  // 展示头像
  showComponent: function () {
    let alert = this.alert
    console.log("aletr=", alert)
    this.setData({
      chengyuantouxiang: "https://wx.qlogo.cn/mmopen/vi_32/ShfohQhEC7WLOUpumsGibMicbh35F3N00m52yO8XpicxayxPQbiadQmHreibZuaUCWJVRRicaYNEeTpvVD0eOcTqZxGg/132",
      nicheng: "哇咔咔及",
      guanlianNum: 1
    })
    this.alert.btn()
  },
  // 跳转管理页面
  tiaozhuanGuanli:function () {
    wx.navigateTo({
      url: '../../pages/guanliTeam/guanliTeam?teamName=' + this.data.teamName +"&teamId="+this.data.teamId,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '小组成员',
    })
    // this.getTeamList(this.data.teamId)
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