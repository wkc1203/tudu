// pages/time/time.js
var util=require("../../utils/util.js")
var dateTimePicker = require('../../public/js/GetDate.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTabtime: 1,
    // 手机号是否获取切换
    currentTab:0,
    year:"",
    today:"",
    tomorrow:"",
    lastTomorrow:"",
    currentDay:"",
    dataHour:'',
    dataMinute:"",
    isduanxin:false,
    phone:"",
    // 小时
    hour: '',
    // 分钟
    minute:'',
    // 其他时间组件
    dateTimeArray1: null,
    dateTime1: null,
    // startYear: 2019,
    endYear: 2050,
    pickerHidden:true,
    arrayList:[],
    index:0,
    minuList: ["00", "15", "30", "45"],
    indexminue:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'phone',
      success: function(res) {
        that.setData({
          phone:res.data
        })
      },
    })
    var list=["00"]
    for(var i=1;i<24;i++) {
      if (i<10) {
        i="0".concat(i)
      }
      list.push(i)
    }
    that.setData({
      arrayList:list
    })
    this.getSystemTime()
  },
  // 时间选择-时
  bindPickerChange:function(e){
    console.log("e=",e)
    this.setData({
      index:e.detail.value,
      hour: this.data.arrayList[e.detail.value],
      dataHour: this.data.arrayList[e.detail.value]
    })
  },
  // 分
  bindPickerChangeMinute: function (e) {
    console.log("e=", e)
    this.setData({
      indexminue: e.detail.value,
      minute: this.data.minuList[e.detail.value],
      dataMinute: this.data.minuList[e.detail.value]
    })
  },
  // 显示其他时间的picker
  clickPick: function(){
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.year, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.year, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();

    this.setData({
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });
    this.setData({
      pickerHidden:false
    })
  },
  // 其他时间选择
  changeDateTime1(e) {
    this.setData({ dateTime1: e.detail.value });
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;
    console.log("ti=", dateArr)

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  },

  // 获取系统时间
  getSystemTime: function () {
    var _this = this
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: app.globalData.server + '/getSysTime',
      method: "get",
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        wx.hideLoading()
        if (res.data && res.data.code == 0) {
          var jmh=res.data.object
          // var today=jmh.jt.slice(jmh.jt.indexOf("-")+1)
          console.log("jt=",jmh)
          console.log("to=", jmh.jt.slice(jmh.jt.indexOf("-") + 1))
          _this.setData({
            year: jmh.jt.slice(0,jmh.jt.indexOf("-")),
            today: jmh.jt.slice(jmh.jt.indexOf("-") + 1),
            tomorrow: jmh.mt.slice(jmh.mt.indexOf("-") + 1),
            lastTomorrow: jmh.ht.slice(jmh.ht.indexOf("-") + 1),
            // currentDay: jmh.jt.slice(jmh.jt.indexOf("-") + 1)
          })
          // 当前时间+5分钟
          // if (parseInt(jmh.time.slice(jmh.time.indexOf(":") + 1, jmh.time.indexOf(":", 3)))<50) {
          //   _this.setData({
          //     dataHour: jmh.time.slice(0, jmh.time.indexOf(":")),
          //     dataMinute: parseInt(jmh.time.slice(jmh.time.indexOf(":") + 1, jmh.time.indexOf(":", 3))) + 5,
          //     hour: jmh.time.slice(0, jmh.time.indexOf(":")),
          //     minute: parseInt(jmh.time.slice(jmh.time.indexOf(":") + 1, jmh.time.indexOf(":", 3))) + 5
          //   })
          // } else {
          //   _this.setData({
          //     dataHour: parseInt(jmh.time.slice(0, jmh.time.indexOf(":"))) + 1,
          //     dataMinute: '05',
          //     hour: parseInt(jmh.time.slice(0, jmh.time.indexOf(":"))) + 1,
          //     minute: '05'
          //   })
          // }
          var pickhoure = parseInt(jmh.time.slice(0, jmh.time.indexOf(":")))
          var pickminute = parseInt(jmh.time.slice(jmh.time.indexOf(":") + 1, jmh.time.indexOf(":", 3)))
          if (pickminute <= 10) {
            // 小时
            for (var i = 0; i < _this.data.arrayList.length;i++) {
              if (_this.data.arrayList[i] == pickhoure) {
                _this.setData({
                  index:i
                })
                break;
              }
            }
            // 分钟
            for (var i = 0; i < _this.data.minuList.length; i++) {
              if (_this.data.minuList[i] == 15) {
                _this.setData({
                  indexminue: i
                })
                break;
              }
            }
            _this.setData({
              dataHour: pickhoure,
              dataMinute: 15,
              hour: pickhoure,
              minute: 15
            })
          } else if (pickminute <= 25 && pickminute>10){
            for (var i = 0; i < _this.data.arrayList.length; i++) {
              if (_this.data.arrayList[i] == pickhoure) {
                _this.setData({
                  index: i
                })
                break;
              }
            }
            for (var i = 0; i < _this.data.minuList.length; i++) {
              if (_this.data.minuList[i] == 30) {
                _this.setData({
                  indexminue: i
                })
                break;
              }
            }
            _this.setData({
              dataHour: pickhoure,
              dataMinute: 30,
              hour: pickhoure,
              minute: 30
            })
          } else if (pickminute <= 40 && pickminute >25) {
            for (var i = 0; i < _this.data.arrayList.length; i++) {
              if (_this.data.arrayList[i] == pickhoure) {
                _this.setData({
                  index: i
                })
                break;
              }
            }
            for (var i = 0; i < _this.data.minuList.length;i++) {
              if (_this.data.minuList[i]==45) {
                _this.setData({
                  indexminue:i
                })
                break;
              }
            }
            _this.setData({
              dataHour: jmh.time.slice(0, jmh.time.indexOf(":")),
              dataMinute: 45,
              hour: jmh.time.slice(0, jmh.time.indexOf(":")),
              minute: 45
            })
          }
          else {
            // 小时
            for (var i = 0; i < _this.data.arrayList.length; i++) {
              if (_this.data.arrayList[i] == (pickhoure+1)) {
                _this.setData({
                  index: i
                })
                break;
              }
            }
            // 分钟
            for (var i = 0; i < _this.data.minuList.length; i++) {
              if (_this.data.minuList[i] == "00") {
                _this.setData({
                  indexminue: i
                })
                break;
              }
            }
            _this.setData({
              dataHour: pickhoure + 1,
              dataMinute: '00',
              hour: pickhoure + 1,
              minute: '00'
            })
          }
        }
      },
      fail(err) {
        wx.hideLoading()
      }
    })
  },
  // 那一天选择
  switchTab: function (e) {
    console.log(e)
    var that = this
    // 获取系统今天此时此刻的时间
    // if (e.currentTarget.dataset.tab != 1) {
    //   this.setData({
    //     hour:'',
    //     minute:''
    //   })
    // } else {
    //     this.setData({
    //       hour: that.data.dataHour,
    //       minute: that.data.dataMinute
    //     })
    // }
    if (e.currentTarget.dataset.tab == 1) {
      this.setData({
        currentDay:that.data.today
      })
    }
    if (e.currentTarget.dataset.tab == 2) {
      this.setData({
        currentDay: that.data.tomorrow,
      })
    }
    if (e.currentTarget.dataset.tab == 3) {
      this.setData({
        currentDay: that.data.lastTomorrow
      })
    }
    if (this.data.currentTabtime === e.currentTarget.dataset.tab) {
      console.log(333)
      return false
    } else {
      console.log(444)
      this.setData({
        currentTabtime: e.currentTarget.dataset.tab
      })
    }
  },

  getPhoneNumber: function (e) {
    // console.log('er-=',e)
    var that = this
    if (e.detail.errMsg !="getPhoneNumber:ok") {
      that.setData({
        currentTab:0,
        isduanxin:false
      })
      return
    }
    wx.checkSession({
      success: res => {
        // console.log('res000=',res)
        if (res.errMsg =="checkSession:ok") {
          wx.getStorage({
            key: 'code',
            success: function(rest) {
              // console.log('restt=',rest)
              var iv = e.detail.iv;
              var encryptedData = e.detail.encryptedData;
              var code = rest.data;
              // console.log('coede=',code)
              var _this = this;
              // 调用后台接口获取用户手机号码
              var token = wx.getStorage({
                key: 'loginUser',
                success: function (res) {
                  // console.log('res.data=', res.data)
                  var tok = res.data.token
                  wx.request({
                    url: app.globalData.server + '/apply',
                    data: {
                      encrypted: encryptedData,
                      iv: iv,
                      code: code,
                      router: "WX_APP_PHONE",
                    },
                    header: {
                      'token': tok,
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    method: "post",
                    success: function (data) {
                      // console.log('succ=', data)
                      // 获取到的手机号码
                      if (data.data.code == 0) {
                        that.setData({
                          isduanxin: true,
                          phone: data.data.object.phone
                        })
                        wx.setStorage({
                          key: 'phone',
                          data: data.data.object.phone,
                        })
                      }
                    },
                    fail: function (msg) {
                      wx.showToast({
                        title: "未获取到手机号",
                        duration: 3000,
                      })
                    }
                  })
                },
              })
            },
          })
        }else{
          wx.login({
            success(res){
              wx.request({
                url: app.globalData.server + '/apply',
                data: {
                  encrypted: encryptedData,
                  iv: iv,
                  router: "WX_APP_PHONE",
                },
                header: {
                  'token': res.token,
                  'content-type': 'application/x-www-form-urlencoded'
                },
                method: "post",
                success: function (data) {
                  // 获取到的手机号码
                  if (data.data.code == 0) {
                    that.setData({
                      isduanxin: true,
                      phone: data.data.object.phone
                    })
                    wx.setStorage({
                      key: 'phone',
                      data: data.data.object.phone,
                    })
                  }
                },
                fail: function (msg) {
                  wx.showToast({
                    title: "未获取到手机号",
                    duration: 3000,
                  })
                }
              })
            }
          })
        }

      },
      fail () {
        wx.login({
          success(res) {
            // console.log('fasul=',res)
            wx.request({
              url: app.globalData.server + '/apply',
              data: {
                encrypted: encryptedData,
                iv: iv,
                router: "WX_APP_PHONE",
              },
              header: {
                'token': res.token,
                'content-type': 'application/x-www-form-urlencoded'
              },
              method: "post",
              success: function (data) {
                // console.log('resphone=',data)
                // 获取到的手机号码
                if (data.data.code == 0) {
                  that.setData({
                    isduanxin: true,
                    phone: data.data.object.phone
                  })
                }
              },
              fail: function (msg) {
                wx.showToast({
                  title: "未获取到手机号",
                  duration: 3000,
                })
              }
            })
          }
        })
      }
    })
    // 参数e是绑定的授权方法自动传入过来的, 主要是为了拿到vi和encryptedData值从后台换取用户联系方式
    
  },
  // 输入时分
  // changeInputValue:function(e) {
  //   // console.log(e)
  //   if (e.currentTarget.dataset.style=="hour") {
  //     this.setData({
  //       hour: e.detail.value,
  //       dataHour: e.detail.value
  //     })
  //   }
  //   if (e.currentTarget.dataset.style == "minute") {
  //     this.setData({
  //       minute: e.detail.value,
  //       dataMinute: e.detail.value
  //     })
  //   }
    
  // },
  // 是否获取手机号
  swichNav:function (e) {
    // console.log('ee=',e)
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false
    } else {
      this.setData({
        currentTab: e.currentTarget.dataset.current
      })
    }
    if (e.currentTarget.dataset.current==0){
      this.setData({
        isduanxin:false
      })
    }else {
      this.setData({
        isduanxin: true
      })
    }
  },
  sendTime: function () {

    var that = this
    var flage = false

    var monthDy=''
    var tixingDay=""
    var tixingTimeContent=""
    if (that.data.pickerHidden){
      if (that.data.currentTabtime == 1) {
        monthDy = that.data.today
        tixingDay = "今天"
      } else if (that.data.currentTabtime == 2) {
        monthDy = that.data.tomorrow
        tixingDay = "明天"
      } else if (that.data.currentTabtime == 3) {
        monthDy = that.data.lastTomorrow
        tixingDay = "后天"
      }
      console.log('hourt=', that.data)
      if (!that.data.hour || !that.data.minute) {
        wx.showToast({
          title: "请输入时间",
          icon: 'fail',
          duration: 3000,
        })
        return
      }
      if (!(/^[0-9]{1,2}$/.test(that.data.hour)) || !(/^[0-9]{1,2}$/.test(that.data.minute))) {
        wx.showToast({
          title: "请输入数字",
          icon: 'fail',
          duration: 3000,
        })
        return
      }
      if (parseInt(that.data.hour) > 24 || parseInt(that.data.minute) > 59) {
        wx.showToast({
          title: "请输入合法时间",
          icon: 'fail',
          duration: 3000,
        })
        return
      }
    }
 
    //再次查询系统时间
    var promis=new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.server + '/getSysTime',
        method: "get",
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          if (res.data && res.data.code == 0) {
            // 其他时间
            const dateTimeArray1 = that.data.dateTimeArray1
            const dateTime1 = that.data.dateTime1

            var jmhN = res.data.object
            // var todayN = jmh.ht.slice(jmh.ht.indexOf("-") + 1)
            var yearN = parseInt(jmhN.jt.slice(0, jmhN.jt.indexOf("-")))
            var todayYR = jmhN.jt.slice(jmhN.jt.indexOf("-") + 1)
            var todayY = parseInt(todayYR.slice(0, todayYR.indexOf("-")))
            var todayR = parseInt(todayYR.slice(todayYR.indexOf("-") + 1))
            var hourN = parseInt(jmhN.time.slice(0, jmhN.time.indexOf(":")))
            var minuteN = parseInt(jmhN.time.slice(jmhN.time.indexOf(":") + 1, jmhN.time.indexOf(":", 3)))
            // 存入的日月
            var todayYRJ = that.data.currentDay
            var todayNJ = 0
            var todayYJ = 0
            var todayRJ = 0
            var todayHJ = 0
            var todayMJ = 0

            // 其他时间，存入的
            if (!that.data.pickerHidden) {
              todayNJ = parseInt(dateTimeArray1[0][dateTime1[0]])
              todayYJ = parseInt(dateTimeArray1[1][dateTime1[1]])
              todayRJ = parseInt(dateTimeArray1[2][dateTime1[2]])
              todayHJ = parseInt(dateTimeArray1[3][dateTime1[3]])
              todayMJ = parseInt(dateTimeArray1[4][dateTime1[4]])
            } else {
              todayNJ = parseInt(that.data.year)
              todayYJ = parseInt(todayYRJ.slice(0, todayYRJ.indexOf("-")))
              todayRJ = parseInt(todayYRJ.slice(todayYRJ.indexOf("-") + 1))
              todayHJ = parseInt(that.data.hour)
              todayMJ = parseInt(that.data.minute)
            }
            // console.log("bij=", hourN, "dt=", todayHJ)
            // console.log("todayR=", todayR, "todayRJ=", todayRJ)
            // console.log("todayR=", todayR, "todayRJ=", todayRJ)
            // console.log("todayY=", todayY, "todayYJ=", todayYJ)
            // console.log("dd=", yearN == todayNJ && todayY == todayYJ && todayR == todayRJ && hourN > todayHJ)
            if (!that.data.pickerHidden) {
              if (yearN == todayNJ && todayY == todayYJ && todayR == todayRJ) {
                tixingDay = "今天"
              }
              if (yearN == todayNJ && todayY == todayYJ && todayR == todayRJ+1) {
                tixingDay = "明天"
              }
              if (yearN == todayNJ && todayY == todayYJ && todayR == todayRJ + 2) {
                tixingDay = "后天"
              } else {
                tixingDay = dateTimeArray1[0][dateTime1[0]].concat("年", dateTimeArray1[1][dateTime1[1]], "月", dateTimeArray1[2][dateTime1[2]],"日")
              }
            }
            if ((yearN > todayNJ) || (yearN == todayNJ && todayY > todayYJ) || (yearN == todayNJ && todayY == todayYJ && todayR > todayRJ) || (yearN == todayNJ && todayY == todayYJ && todayR == todayRJ && hourN > todayHJ) || (yearN == todayNJ && todayY == todayYJ && todayR == todayRJ && hourN == todayHJ && minuteN > todayMJ)) {
              flage = true
            }
            if (flage) {
              wx.showModal({
                title: '提示',
                content: '提醒时间已过或即将过，请重新选择时间',
                showCancel:false,
                success(res) {
                  if (res.confirm) {
                    that.onLoad()
                  }
                }
              })
              
              return
            }
            var tixingTime=""
            if (!that.data.pickerHidden) {
              tixingTime = dateTimeArray1[0][dateTime1[0]].concat("-", dateTimeArray1[1][dateTime1[1]], "-", dateTimeArray1[2][dateTime1[2]], " ", dateTimeArray1[3][dateTime1[3]], ":", dateTimeArray1[4][dateTime1[4]])
              if (parseInt(dateTimeArray1[3][dateTime1[3]]) > 13) {
                tixingTimeContent = tixingDay.concat(util.switchTime(parseInt(dateTimeArray1[3][dateTime1[3]])), parseInt(dateTimeArray1[3][dateTime1[3]]) - 12, "点", dateTimeArray1[4][dateTime1[4]], " ", "提醒我")
              } else {
                tixingTimeContent = tixingDay.concat(util.switchTime(parseInt(dateTimeArray1[3][dateTime1[3]])), dateTimeArray1[3][dateTime1[3]], "点", dateTimeArray1[4][dateTime1[4]], " ", "提醒我")
              }
            } else {
              tixingTime = that.data.year.concat("-", monthDy, " ", that.data.hour, ":", that.data.minute)
              if (that.data.hour > 13) {
                tixingTimeContent = tixingDay.concat(util.switchTime(parseInt(that.data.hour)), parseInt(that.data.hour) - 12, "点", that.data.minute, " ", "提醒我")
              } else {
                tixingTimeContent = tixingDay.concat(util.switchTime(parseInt(that.data.hour)), that.data.hour, "点", that.data.minute, " ", "提醒我")
              }
            }
            // console.log(util)
            var phone=""
            var isMsgRemind=0
            if (that.data.isduanxin) {
              phone=that.data.phone
              isMsgRemind=1
            }
            // console.log('phone=',phone)
            var pages = getCurrentPages();
            var currPage = pages[pages.length - 1];   //当前页面
            var prevPage = pages[pages.length - 2];  //上一个页面
            prevPage.setData({
              tixingTime: tixingTime,
              tixingTimeContent: tixingTimeContent,
              isMsgRemind: isMsgRemind,
              phone: phone
            })
            wx.navigateBack({
              delta:1
            })
            // wx.redirectTo({
            //   url: "../../pages/sendSay/sendSay?tixingTime=" + tixingTime + "&tixingTimeContent=" + tixingTimeContent + "&phone=" + phone + "&isMsgRemind=" + isMsgRemind
            // })
          }
        }
      })
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
    wx.setNavigationBarTitle({
      title: '提醒时间',
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
  onShareAppMessage: function () {

  }
})