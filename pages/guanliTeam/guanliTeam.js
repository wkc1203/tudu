// pages/guanliTeam/guanliTeam.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberList:[],
    memberNum:0,
    teamName:"",
    teamId:0,
    chengyuantouxiang:"",
    nicheng:"",
    userId:0,
    groupId:0,
    // 修改备注和删除后刷新
    deleRefer:false,
    // 1修改 2 删除
    coazuoType:"",
    // 是否可解散小组
    isYaoQin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options=",options)
    if (options && options.teamName) {
      this.setData({
        teamName: options.teamName
      })
    }
    if (options && options.isYaoQin) {
      this.setData({
        isYaoQin:options.isYaoQin==1?true:false
      })
    }
    if (options && options.teamId) {
      this.setData({
        groupId:options.teamId
      })
      this.getMemberList(options.teamId)
    }
    
  },
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
          success(rest) {
            if (rest.data.code == 0) {
              if (rest.data && rest.data.object) {
                var members = rest.data.object
                for (var i = 0; i < members.length;i++) {
                  members[i]["isQuanXian"] = (members[i].userId==res.data.id)
                }
                _this.setData({
                  memberList: rest.data.object,
                  memberNum: rest.data.object.length
                })
              }
              
            }
          }
        })
      },
    })
  },
  // 删除组员
  deleteMember:function (e) {
    var that = this
    this.setData({
      nicheng: e.currentTarget.dataset.it.nickName,
      chengyuantouxiang: e.currentTarget.dataset.it.headImg,
      userId: e.currentTarget.dataset.it.userId,
      groupId: that.data.groupId,
      deleRefer:false,
      coazuoType: e.currentTarget.dataset.coazuotype
    })
    this.tankuang.btn()
  },
  // 修改备注名称
  tanchukuang:function (e) {
    var that=this
    this.setData({
      nicheng: e.currentTarget.dataset.it.nickName,
      chengyuantouxiang: e.currentTarget.dataset.it.headImg,
      userId: e.currentTarget.dataset.it.userId,
      groupId: that.data.groupId,
      deleRefer: false,
      coazuoType: e.currentTarget.dataset.coazuotype
    })
    this.tankuang.btn()
  },
  // 修改小组名称
  xiugaiTeamName:function (e) {
    var that=this
    this.setData({
      deleRefer: false,
      groupId: that.data.groupId,
      coazuoType: e.currentTarget.dataset.coazuotype
    })
    this.tankuang.btn()
  },
  // 解散小组
  deleteTeam:function (e) {
    console.log("e=",e)
    // this.setData({
    //   userId: e.currentTarget.dataset.it.userId,
    //   groupId: that.data.groupId,
    //   deleRefer: false,
    //   coazuoType: e.currentTarget.dataset.coazuotype
    // })
    // this.tankuang.btn()
    var that=this
    wx.getStorage({
      key: 'loginUser',
      success: function(res) {
        that.setData({
          userId: res.data.id,
          groupId: that.data.groupId,
          deleRefer: false,
          coazuoType: e.currentTarget.dataset.coazuotype
        })
        that.tankuang.btn()
      },
    })
  },
  // 添加组员
  // 邀请加入
  tiaozhuanGuanli: function () {
    var that = this
    wx.getStorage({
      key: 'loginUser',
      success: function (res) {
        wx.request({
          url: app.globalData.server + '/apply',
          data: {
            router: "IS_GROUPMEMBERMAX",
            groupId: that.data.groupId
          },
          method: "post",
          header: {
            "token": res.data.token,
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(re) {
            if (re.data.code == 0) {
              console.log(re)
              wx.getStorage({
                key: 'loginUser',
                success: function (res) {
                  // 如果可以邀请
                  if (re.data.object > 0) {
                    wx.navigateTo({
                      url: '../../pages/creatFinish/creatFinish?memberNum=' + re.data.object + "&teamName=" + that.data.teamName + "&touxiang=" + res.data.headImg + "&nicheng=" + res.data.nickName + "&groupId=" + that.data.groupId,
                    })
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: '小组成员已达到最大邀请限制\r\n[10/10]',
                      showCancel: false
                    })
                  }
                },
              })


            } else {
              wx.showModal({
                title: '提示',
                content: '小组成员已达到最大邀请限制\r\n[10/10]',
                showCancel: false
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
    this.tankuang = this.selectComponent('#tankuangComponent')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '小组管理',
    })
    // if(this.data.deleRefer) {
    //   this.getTeamList(this.data.teamId)
    //   this.getMemberList(this.data.teamId)
    // }
    
    // this.getTeamList(options.teamId)
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