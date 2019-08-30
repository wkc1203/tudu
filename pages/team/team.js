// pages/team/team.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    currentTab: 0,
    // 小组列表
    rangekey:0,
    // 代办
    daibanNum:0,
    myUnFinish: [],
    // 已完成
    finishNum:0,
    myFinish: [],
    messagList: [],
    // 某一个团队
    teamNamesId:0,
    teamName:"",
    teamNames: [],
    // 显示成员弹框
    memberShow:false,
    // 成员头像
    chengyuantouxiang:"",
    // 成员Id
    memberId:0,
    nicheng:"",
    // 关联的事件
    guanlianNum:0,

    // 该用户的所有团队
    show: false,
    actions: [],
    // 团队详细信息
    arrayList:[],
    // 是否是登陆人，如果是则可邀请
    isYaoQin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    app.editTabbar()
    // this.getCreatTeam()
    console.log("datt=",this.data)
    var that=this
    console.log("ds=", that.data.actions.length)
    // if (this.data.actions.length>1) {
    //   this.getRenWu(0)
    // }
    this.setData({
      messagList: [
        {
          url: "url",
          title: "专注每一件小事"
        },
        {
          url: "url",
          title: "凸度使用小问卷"
        }
      ]
    })
    wx.hideLoading();
    console.log("dt=",this.data.teamNames)
  },

  // 测试弹框
  // showComponent:function () {
  //   let alert = this.alert
  //   console.log("aletr=",alert)
  //   this.setData({
  //     chengyuantouxiang: "https://wx.qlogo.cn/mmopen/vi_32/ShfohQhEC7WLOUpumsGibMicbh35F3N00m52yO8XpicxayxPQbiadQmHreibZuaUCWJVRRicaYNEeTpvVD0eOcTqZxGg/132",
  //     nicheng: "哇咔咔及",
  //     guanlianNum:1
  //   })
  //   this.alert.btn()
  // },
  // 获取任务列表
  getRenWu: function (status) {
    var _this = this
    console.log("thai=",this.data)
    wx.getStorage({
      key: 'loginUser',
      success: function (res) {
        wx.showLoading({
          title: '数据获取中',
          mask: true
        })
        wx.request({
          url: app.globalData.server + '/apply',
          data: {
            router: "GET_TASK_LIST",
            type: "group",
            mineGroupId: "",
            status: status,
            groupId: _this.data.teamNamesId
          },
          method: "post",
          header: {
            "token": res.data.token,
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(re) {
            console.log("re=", re.data)
            // console.log("contentJson=", re.data.object.myTask.contentJson)
            // console.log("contentJSON=", JSON.parse(re.data.object.myTask[0].shijian[0].taskInfos[3].contentJson))
            if (re.data.code == 0 && re.data.object) {
              // 代办
              if (status == 0) {
                _this.setData({
                  daibanNum: re.data.object.goingCount < 0 ? 0 : re.data.object.goingCount,
                  finishNum: re.data.object.finishCount < 0 ? 0 : re.data.object.finishCount,
                  myUnFinish: re.data.object.myTask
                })
              }
              if (status == 1) {
                _this.setData({
                  finishNum: re.data.object.finishCount < 0 ? 0 : re.data.object.finishCount,
                  daibanNum: re.data.object.goingCount < 0 ? 0 : re.data.object.goingCount,
                  myFinish: re.data.object.myTask
                })
              }
              if (re.data.object.memberCards) {
                _this.setData({
                  teamNames: re.data.object.memberCards
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
  // 获取所有的小组列表
  getCreatTeam:function () {
    var _this=this
    wx.getStorage({
      key: 'loginUser',
      success: function(res) {
        wx.showLoading({
          title: '数据获取中',
          mask: true
        })
        wx.showLoading({
          title: '',
          mask:true
        })
        wx.request({
          url: app.globalData.server + '/apply',
          data: {
            router: "GET_GROUPS",
            memberType: ""
          },
          method: "post",
          header:{
            "token":res.data.token,
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(rest) {
            console.log("xilist=",res)
            var firstObj = { id: 10, name: '创建小组'}
            var arrayList = []
            arrayList.push(firstObj)
            if (rest.data.code == 0 && rest.data.object.length>0) {
              for (var i = 0; i < rest.data.object.length; i++) {
                var obj = {}
                obj.id = rest.data.object[i].id
                obj.name = rest.data.object[i].groupName,
                obj.isYaoQin = (res.data.id == rest.data.object[i].creator)
                arrayList.push(obj)
              }
              _this.setData({
                // arrayList: arrayList,
                teamName: rest.data.object[0].groupName,
                teamNamesId:rest.data.object[0].id
              })
              console.log("list=", arrayList)
            }else {
              _this.setData({
                teamName: "创建小组",
                arrayList: arrayList,
              })
            }
            console.log("arrayList=", arrayList)
            if (arrayList.length>1) {
              _this.setData({
                rangekey:1,
                isYaoQin: arrayList[1].isYaoQin
              })
            }
            _this.setData({
              actions: arrayList,
              arrayList: arrayList,
            })
            if (rest.data.object.length > 0) {
              _this.getRenWu(0)
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
        wx.hideLoading()
      },
    })
    
  },
    // 弹出小组列表
  bindPickerChange: function (e) {
    var that = this
    // console.log("xiaoz=", e.detail)
    // console.log("lsit=",this.data.arrayList)
    if (e.detail.value==0) {
      that.creatTeamNumber()
    }else {
      // 动态获取左上角团队名称及人员
      if (that.data.arrayList.length>1) {
        that.setData({
          rangekey: e.detail.value,
          teamNamesId: that.data.arrayList[e.detail.value].id,
          teamName: that.data.arrayList[e.detail.value].name,
          isYaoQin: that.data.arrayList[e.detail.value].isYaoQin
        })
        // console.log("teamNamesId=", that.data.teamNamesId)
        if (that.data.currentTab==0) {
          that.getRenWu(0)
        }
        if (that.data.currentTab == 1) {
          that.getRenWu(1)
        }
      }
    }
  },


  // 查询已创建小组数量
  creatTeamNumber:function () {
    wx.getStorage({
      key: 'loginUser',
      success: function(res) {
        wx.showLoading({
          title: '加载中',
        })
        wx.request({
          url: app.globalData.server + '/apply',
          data: {
            router: "IS_CREATEGROUPMAX"
          },
          method:"post",
          header: {
            'token': res.data.token,
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(res1) {
            wx.hideLoading()
            console.log('res=',res1)
            if (res1.data.code == 0) {
              if (res1.data.object<=0) {
                wx.showModal({
                  title: '提示',
                  content: '创建小组数量已达到最大限制\r\n[5/5]',
                  showCancel: false
                })
              }else {
                wx.navigateTo({
                  url: "../../pages/creatXiaoZhu/creatXiaoZhu?shengyuCreat=" + res1.data.object
                })
              }
              
            } else {
              wx.showToast({
                title: '未知错误',
              })
            }
          }
        })
      },
    })
  },
  // formId
  // sendForm:function () {
  //   wx.request({
  //     url: '',
  //   })
  // },
  // 滑块切换
  swichNav: function (e) {
    var that = this
    if (this.data.currentTab === e.target.dataset.current) {
      return false
    } else {
      this.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  bindChange: function (e) {
    console.log('bingChange=', e.detail)
    this.setData({ currentTab: e.detail.current });
    if (e.detail.current == 1) {
      this.getRenWu(1)
    }
    if (e.detail.current == 0) {
      this.getRenWu(0)
    }
  },
  // 邀请加入
  inviteRember:function () {
    var that=this
    wx.getStorage({
      key: 'loginUser',
      success: function(res) {
        wx.request({
          url: app.globalData.server + '/apply',
          data:{
            router:"IS_GROUPMEMBERMAX",
            groupId: that.data.teamNamesId
          },
          method:"post",
          header:{
            "token":res.data.token,
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(re) {
            if (re.data.code==0) {
              console.log(re)
              wx.getStorage({
                key: 'loginUser',
                success: function(res) {
                  // 如果可以邀请
                  if (re.data.object > 0) {
                    wx.navigateTo({
                      url: '../../pages/creatFinish/creatFinish?memberNum=' + re.data.object + "&teamName=" + that.data.teamName + "&touxiang=" + res.data.headImg + "&nicheng=" + res.data.nickName + "&groupId=" + that.data.teamNamesId,
                      // url: "../../pages/jiaru/jiaru?groupId=" + that.data.groupId + "&touxiang=" + res.data.headImg + "&teamName=" + that.data.teamName + "&nicheng=" + res.data.nickName,
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
              
              
            }else {
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
    // that.data.
  },
  // 显示全部
  showAllMember:function () {
    wx.navigateTo({
      url: '../../pages/teamAllMember/teamAllMember?teamId=' + this.data.teamNamesId +"&teamName="+this.data.teamName,
    })
  },
  // 点击成员头像弹出
  alertDetail:function (e) {
    console.log("eee=",e)
    this.setData({
      memberShow:true
    })
    if (e.detail) {
      this.setData({
        chengyuantouxiang: e.currentTarget.dataset.chengyuan.memberHeadImg,
        nicheng: e.currentTarget.dataset.chengyuan.memberName || e.currentTarget.dataset.chengyuan.nikeName,
        memberId: e.currentTarget.dataset.chengyuan.memberId,
        guanlianNum: e.currentTarget.dataset.chengyuan.connectTaskCount
      })
      this.alert.btn()
    }
  },

  // 点击弹出详情
  skipDetail: function (e) {
    console.log(e)
    if (e) {
      wx.setStorage({
        key: 'detailShiJian',
        data: e.currentTarget.dataset.item,
      })
      wx.navigateTo({
        url: `../details/detail?happendDate=` + e.currentTarget.dataset.happendtime + "&happendweek=" + e.currentTarget.dataset.happendweek + "&isFinish=" + e.currentTarget.dataset.isfinish,
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    app.hidetabbar()
    this.alert = this.selectComponent('#myComponent')
    // console.log('this.alert=',this.alert)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.hidetabbar()
    this.getCreatTeam()
    this.getRenWu(0)
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