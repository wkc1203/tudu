// pages/teamMember/teamMember.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // memberNum:0,
    // // 小组成员
    memberList:[],
    // 被选中的成员
    checkedMember:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("optins=",options)
    if (options && options.teamId) {
      this.getMemberList(options.teamId);
    }
    
  },
  // 获取团队人员
  getMemberList: function (teamId) {
    var _this=this
    wx.getStorage({
      key: 'loginUser',
      success: function(res) {
        wx.showLoading({
          title: '加载中',
        })
        wx.request({
          url: app.globalData.server + '/apply',
          data: {
            router:"PUSH_TASK_BUT",
            groupId: teamId,
          },
          method:"post",
          header:{
            "token":res.data.token,
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            wx.hideLoading()
            // console.log("res=", res.data)
            if (res.data.code==0) {
              var memberLists=[]
              if (res.data.object.length>0) {
                for (var i = 0; i < res.data.object.length; i++) {
                  var obj = res.data.object[i]
                  obj.isSelected=false
                  memberLists[i]=obj
                }
              }
              _this.setData({
                memberList: memberLists
              })
            }
          }
        })
      },
    })
  },
  // 选中所有
  selectAll:function () {
    var that=this
    if (that.data.memberList.length>0) {
      for (var i = 0; i < that.data.memberList.length;i++) {
        that.data.memberList[i].isSelected = !that.data.memberList[i].isSelected
      }
      this.setData({
        memberList:that.data.memberList,
        checkedMember: that.data.memberList
      })
    }
    console.log("my=", that.data.memberList)
  },
  // checkboxChange: function (e) {
  //   console.log("this=",this.data)
  //   console.log('checkbox发生change事件，携带value值为：', e)
  //   this.setData({
  //     checkedMember:e.detail.value
  //   })
  // },
  itemSelected: function (e) {
    console.log("memberList=", this.data.memberList)
    var index = e.currentTarget.dataset.index;
    var item = this.data.memberList[index];
    console.log("item=",item)
    item.isSelected = !item.isSelected;
    this.setData({
      memberList: this.data.memberList,
      checkedMember: this.data.checkedMember.concat(item),
    });
  },
  // 选择成员后
  sendMember:function () {
    var pages = getCurrentPages()
    var currentPage = pages[pages.length-1]
    var prePage = pages[pages.length-2]
    var that=this
    var members=that.data.checkedMember
    // console.log("members=", members)
    // 存放成员ID
    var memberIds=""
    var membersnicheng=""
    var memberMeIds=[]
    var memberMeIdss = []
    if (members.length>0) {
      for (var i = 0; i<members.length;i++) {
        // console.log("i=", members[i].nickName)
        var stb = "@" + members[i].nickName+";"
        var stbb = "@" + members[i].nickName
        // console.log("stb=",stb)
        // console.log("members[i].userId=", members[i].userId)
        memberIds=memberIds.concat(members[i].userId,",")
        membersnicheng = membersnicheng.concat(stb)
        var stNI = stbb.concat(",", members[i].userId)
        memberMeIds = memberMeIds.concat(stNI)
        // 为了查找
        var stnI = stbb.concat(";", members[i].userId)
        memberMeIdss = memberMeIdss.concat(stnI)
      }
    }
    console.log("memberMeIds=", memberMeIds)
    console.log("memberMeIdss=", memberMeIdss.join(","))
    console.log("chengyuan=", prePage.data)
    console.log("membersnicheng=", membersnicheng)
    prePage.setData({
      insertContent: prePage.data.insertContent.concat(membersnicheng),
      curos: prePage.data.curos + membersnicheng.length,
      insertTeamMember: prePage.data.insertTeamMember.concat(memberMeIdss),
      atUserid: memberIds.slice(0, memberIds.length-1)
    })
    wx.navigateBack({
      delta:1
    })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '选择联系人',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // wx.setNavigationBarTitle({
    //   title: '小组成员',
    // })
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