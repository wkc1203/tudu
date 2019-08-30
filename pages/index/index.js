// pages/index/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    currentTab: 0,
    // 完成
    finishNum:0,
    myUnFinish: [],
    
    // 代办数量
    daibanNum:0,
    myFinish: [],
    // 跑马灯
    messagList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.editTabbar()
    // 获取我的代办事件
    // this.getRenWu(0)
    this.setData({
      // myFinish: [
      //   {
      //     happendDate: "今天",
      //     shijian:[
      //       {
      //         happendTime: "2019年7月15日",
      //         happendWeek: "星期二",
      //         incident: [
      //           {
      //             id:215,
      //             title: "BBq",taskTitle
      //             content: "下班取楼下拿快递wew撒旦发射点@小王看见[东原D7]分厘卡圣诞节分厘卡电视机离开房间都是垃圾分类的沙发了的时间里立刻解放拉萨解放了就深大路口附近dsfdsfd士大夫士大夫但是但是发射点发射点",taskCentent
      //             time: "",showReminderTime
      //             tixing: 0,isRemind
      //             site:["东原D7"],taskAddress
      //             joinMember: [
      //               {
      //                 name: "小王",
      //                 id: 25
      //               },
      //               {
      //                 name: "小李",
      //                 id: 24
      //               }
      //             ]
      //           },
      //           {
      //             id:216,
      //             content: "晚上回家把衣服洗了发生的拉多斯拉夫的萨拉飞机的数量咖啡机的手法讲述了等级分类的洒家分厘卡世界的咖啡机案例圣诞节分厘卡圣诞节反抗螺丝钉",
      //             time: "20点41",
      //             tixing: 1
      //           },
      //           {
      //             id:217,
      //             content: "明天自己带饭",
      //             time: "21点41",
      //             tixing: 0
      //           }
      //         ]
      //       }
      //     ]
          
      //   },
      //   {
      //     happendDate: "明天",
      //     shijian: [
      //       {
      //         happendTime: "2019年7月10日",
      //         happendWeek: "星期一",
      //         incident: [
      //           {
      //             id:218,
      //             title: "BBq",
      //             content: "下班取楼下拿快都是非法的开始减肥了电视机分厘卡绝对是看到封建势力飞机迪斯科浪费绝对是离开家但是发射点发射点犯得上发射点发射点",
      //             time: "18点32",
      //             tixing: 0,
      //             joinMember:[
      //               {
      //                 name: "小王",
      //                 id: 25
      //               },
      //               {
      //                 name: "小李",
      //                 id: 24
      //               }
      //             ]
      //           },
      //           {
      //             id:219,
      //             content: "晚上回家把衣服洗了",
      //             time: "20点42",
      //             tixing: 0
      //           },
      //         ]
      //       }
      //     ]
          
      //   },
      //   {
      //     happendDate: "本周",
      //     shijian: [
      //       {
      //         happendTime: "2019年7月24日",
      //         happendWeek: "星期四",
      //         incident: [
      //           {
      //             id:210,
      //             content: "下班取楼下拿快递",
      //             time: "18点33",
      //             tixing: 0
      //           },
      //           {
      //             id:211,
      //             content: "晚上回家把衣服洗了",
      //             time: "20点43",
      //             tixing: 0
      //           },
      //         ]
      //       },
      //       {
      //         happendTime: "2019年7月25日",
      //         happendWeek: "星期五",
      //         incident: [
      //           {
      //             id:212,
      //             content: "下班取楼下拿快递",
      //             time: "18点34",
      //             tixing: 0
      //           },
      //           {
      //             id:213,
      //             content: "晚上回家把衣服洗了",
      //             time: "20点44",
      //             tixing: 0
      //           },
      //           {
      //             id:214,
      //             content: "晚上回家把衣服洗了",
      //             time: "22点44",
      //             tixing: 0
      //           },
                
      //         ]
      //       },
      //     ]
          
      //   },
      //   {
      //     happendDate: "下周",
      //     shijian: [
      //       {
      //         happendTime: "2019年7月29日",
      //         happendWeek: "星期一",
      //         incident: [
      //           {
      //             id:215,
      //             content: "下班取楼下拿快递",
      //             time: "18点35",
      //             tixing: 0
      //           },
      //           {
      //             id:216,
      //             content: "晚上回家把衣服洗了",
      //             time: "20点45",
      //             tixing: 0
      //           },
      //         ]
      //       },
      //       {
      //         happendTime: "2019年7月30日",
      //         happendWeek: "星期二",
      //         incident: [
      //           {
      //             id:217,
      //             content: "下班取楼下拿快递",
      //             time: "18点36",
      //             tixing: 0
      //           },
      //           {
      //             id:218,
      //             content: "晚上回家把衣服洗了",
      //             time: "20点46",
      //             tixing: 0
      //           },
      //         ]
      //       },
      //     ]

      //   }
      // ],
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
    
  },
  // 获取任务列表
  getRenWu:function (status) {
    var _this=this
    wx.getStorage({
      key: 'loginUser',
      success: function(res) {
        wx.showLoading({
          title: '数据获取中',
          mask:true
        })
        wx.request({
          url: app.globalData.server +'/apply',
          data: {
            router: "GET_TASK_LIST",
            type: "mine",
            mineGroupId: res.data.privateGroup,
            status: status,
          },
          method:"post",
          header:{
            "token":res.data.token,
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(re) {
            console.log("re=",re)
            if (re.data.code==0) {
              // 代办
              if (status==0) {
                _this.setData({
                  daibanNum: re.data.object.goingCount < 0 ? 0 : re.data.object.goingCount,
                  finishNum: re.data.object.finishCount < 0 ? 0 : re.data.object.finishCount,
                  myUnFinish: re.data.object.myTask
                })
              }
              if (status==1) {
                _this.setData({
                  finishNum: re.data.object.finishCount < 0 ? 0 : re.data.object.finishCount,
                  daibanNum: re.data.object.goingCount < 0 ? 0 : re.data.object.goingCount,
                  myFinish: re.data.object.myTask
                })
              }
            }
            wx.hideLoading()
          },
          fail(err){
            wx.hideLoading()
            wx.showToast({
              title: err.errMsg,
            })
          }
        })
      },
    })
    
  },
  // 点击头像弹出
  openMyTeam: function () {
    // 上传FORMiD
    
    wx.navigateTo({
      url: '../../pages/personalCenter/personalCenter',
    })
    // wx.showModal({
    //   title: '提示',
    //   content: '这是一个模态弹窗',
    //   success(res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
  },
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
    // console.log('bingChange=', e.detail)
    this.setData({ currentTab: e.detail.current });
    if (e.detail.current==1) {
      this.getRenWu(1)
    }
    if (e.detail.current==0) {
      this.getRenWu(0)
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
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.hidetabbar()
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
    this.getRenWu(0)
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