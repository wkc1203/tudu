// pages/details/detail.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailContent:{},
    dongzuo:0,
    // 是否完成
    isFinish:true,
    disabled:false,
    happendWeek:"",
    happendTime:"",
    deleteCount:0,
    memberShow:false,
    chengyuantouxiang:"",
    nicheng:"",
    memberId:"",
    guanlianNum:0,
    taskAddress:"",
    // 人员Id
    userJson:"",
    id:"",
    x: 0,
    y: 0,
    // 滑块宽度
    areaWidth:0,
    // 背景条显示
    xianshi:"往右滑动"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options=",options)
    
    if (options) {
      this.setData({
        happendTime: options.happendDate,
        happendWeek: options.happendweek
      })
      if (options.isFinish=="false") {
        this.setData({
          isFinish:false
        })
      }
      if (options.isFinish == "true") {
        this.setData({
          isFinish: true
        })
      }
    }
    var _this=this
    // var windowWidth = wx.getSystemInfoSync().windowWidth
    var areaselect = wx.createSelectorQuery()
    areaselect.select('.after_bottom_switch_area').boundingClientRect(function (rec) {
      _this.setData({
        areaWidth: rec.width
      })
    }).exec()
    // console.log('this=',this.data)
    wx.getStorage({
      key: 'detailShiJian',
      success: function(res) {
        // console.log("rest=",res.data)
        var detial=res.data
        if (detial) {
          // 封装内容 gaibian=0为不显示其他颜色 1为人物显示紫色2为地址显示绿色
          var stb = []
          for (var i = 0; i < detial.contentJsonList.length; i++) {
            console.log("it=", detial.contentJsonList[i])
            var obj = {}
            obj.content = detial.contentJsonList[i]
            if (detial.userJson && detial.userJson.indexOf(detial.contentJsonList[i]) > -1) {
              obj.gaibian = 1
            } else {
              obj.gaibian = 0
            }
            if (detial.contentJsonList[i].indexOf("「") > -1 && detial.contentJsonList[i].indexOf("」") > -1) {
              console.log("eeeet")
              var stlocation = detial.contentJsonList[i].slice(1, detial.contentJsonList[i].indexOf("」"))
              console.log("ete=", stlocation)
              if (detial.taskAddress.indexOf(stlocation) > -1) {
                obj.gaibian = 2
              }
            }
            stb.push(obj)
          }
          var touxiang=""
          var nicheng=""
          if (detial.creatorInfo) {
            touxiang = detial.creatorInfo.headImg
            nicheng = detial.creatorInfo.memberName ? detial.creatorInfo.memberName : detial.creatorInfo.nikeName
          }
          _this.setData({
            id: detial.id,
            detailContent: {
              title: detial.taskTitle,
              happendDate: detial.showReminderTime ? detial.showReminderTime : "",
              happendTime: detial.showTimeDetail,
              happendWeek: detial.week,
              // content: detial.taskCentent,
              time: detial.showReminderTime,
              tixing: detial.isRemind,
              touxiang: touxiang,
              nicheng: nicheng,
              content: stb,
              status: detial.status
              // userJson:detial.userJson
            },
            userJson: detial.userJson,
            taskAddress: detial.taskAddress
          })
        }
        
      },
    })
  },
  // 拖动
  tuodongChange:function (e) {
    var that = this
    console.log('tuodong=',e)
    
    // console.log('widit=', this.data.windowWidth)
    console.log('x=',e.detail.x)
    console.log('areaWidth=', this.data.areaWidth)
    console.log('d=', e.detail.x < (this.data.areaWidth / 2))
    var timeOutflag = null
    // this.debounce(function (e){
      console.log('e=',e)
      if (e.detail.x < (this.data.areaWidth / 2)) {
          that.setData({
            x: 0
          })
      } else {
        that.setData({
          x: that.data.areaWidth,
          deleteCount: that.data.deleteCount + 1,
          disabled: true,
          dongzuo: 1,
          xianshi: "已完成"
        }, () => {
          console.log("huidiaoyoumeiyou")
          console.log('this=', that.data)
          that.finishEvent()
        })
      }
    
  },
  throttle:function(fn, interval) {
    var enterTime = 0;//触发的时间
    var gapTime = interval || 1000 ;//间隔时间，如果interval不传，则默认300ms
    return function () {
      var context = this;
      var backTime = new Date();//第一次函数return即触发的时间
      if (backTime - enterTime > gapTime) {
        fn.call(context, arguments);
        enterTime = backTime;//赋值给第一次触发的时间，这样就保存了第二次触发的时间
      }
    };
  },
  // dangdou
  debounce:function(fn, interval) {

    var timer;
    var gapTime = interval || 1000;//间隔时间，如果interval不传，则默认1000ms
    return function () {
      console.log(8888)
      var context = this;
      var args = arguments;//保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
      if(timer){
        clearTimeout(timer)
      }
      timer = setTimeout(function () {
        console.log(63636)
        fn.call(context, args);
      }, gapTime);
    };
  },
  // 拖动完成
  finishEvent: function () {
    var that=this
    wx.getStorage({
      key: 'loginUser',
      success: function(res) {
        wx.showLoading({
          title: '事件完成中',
          mask:true
        })
        wx.showToast({
          title: '',
        })
        wx.request({
          url: app.globalData.server + '/apply', 
          data: {
            router: "EDIT_TASK",
            taskId: that.data.id,
            statuse:1
          },
          method: "post",
          header: {
            "token": res.data.token,
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(rest) {
            console.log("rest=",rest)
            wx.hideLoading()
            if (rest.data.code == 0) {
              wx.showToast({
                title: '事件已完成',
              })
              wx.navigateBack({
                delta: 1
              })
            }else {
              wx.showToast({
                title: "失败",
              })
            }
          },
          fail(err) {
            wx.hideLoading()
            wx.showToast({
              title: err,
            })
          }
        })
      },
    })
   
  },
  // 删除事件
  deteleShiJian:function () {
    var that=this
    wx.showModal({
      title: '警告',
      content: '您确定要删除吗？',
      success(res) {
        if (res.confirm) {
          wx.getStorage({
            key: 'loginUser',
            success: function(rest) {
              wx.showLoading({
                title: '删除中',
              })
              wx.request({
                url: app.globalData.server + '/apply', 
                data: {
                  router:"DEL_TASK",
                  taskId:that.data.id
                },
                method:"post",
                header:{
                  "token":rest.data.token,
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success(re) {
                  wx.hideLoading()
                  if (re.data.code==0) {
                    wx.showToast({
                      title: '删除成功',
                    })
                    wx.navigateBack({
                      delta:1
                    })
                  }else{
                    wx.showToast({
                      title: '删除失败',
                    })
                  }
                  
                },
                fail(err) {
                  wx.hideLoading()
                  wx.showToast({
                    title: err,
                  })
                }
              })
            },
          })
        }
      }
    })
  },
  // 修改
  xiugai:function() {
    console.log("dtxiugai=", this.data)
    wx.navigateTo({
      url: '../../pages/sendSay/sendSay?taskId='+this.data.id+"&type="+this.data,
    })
  },
  // 弹出
  alertDetail: function (e) {
    console.log("eee=", e)
    // 对应的人
    var man=e.currentTarget.dataset.content
    var flag = e.currentTarget.dataset.flag
    if (flag==0) {
      return
    }
    var that=this
    // 对应人的id
    var uId=""
    var userId =[]
    if (that.data.userJson) {
      userId = that.data.userJson.split(",")
    }
    // var userId = that.data.userJson.split(",")
    if (flag==1 && userId && userId.length>0) {
      for(var i=0;i<userId.length;i++) {
        if (userId[i].indexOf(man)>-1){
          uId=userId[i].split(";")[1]
        }
      }
    }
    // 地址 -打开地图
    console.log("that=",that.data)
    var location = that.data.taskAddress.split(";")
    console.log("location=", location)
    var locd = man.slice(1, man.indexOf("」"))
    console.log("locd=",locd)
    if (flag == 2 && location && location.length>0) {
      for (var i = 0; i < location.length;i++) {
        if (location[i].indexOf(locd)>-1) {
          wx.openLocation({
            latitude: parseInt(location[i].split(":")[1].split(",")[0]),
            longitude: parseInt(location[i].split(":")[1].split(",")[1]),
            
          })
        }
      }
    }
    if (uId==""){
      return
    }
    console.log("userid=", userId)
    wx.getStorage({
      key: 'loginUser',
      success: function(res) {
        wx.request({
          url: app.globalData.server + '/apply',
          data:{
            router:"MEMBER_CARD",
            userId: uId
          },
          method: "post",
          header: {
            "token": res.data.token,
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            console.log("res=",res)
            if (res.data.code==0) {
              var de = res.data.object
              that.setData({
                memberShow: true,
                chengyuantouxiang: de.headImg,
                nicheng: de.memberName || de.nikeName,
                memberId: de.id,
                guanlianNum: de.checkInCount
              })
              that.alert.btn()
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
    wx.setNavigationBarTitle({
      title: '事情',
    })
    this.alert = this.selectComponent('#myComponent')
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
    this.setData({
      x:0,
      y:0
    })
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