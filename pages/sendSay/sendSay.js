// pages/sendSay/sendSay.js
// var set=this.data.isHidePlaceholder
// console.log("se=",set)
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 文本框高度
    height:"",
    currentTab: 0,
    rangekey:0,
    xiaozuName: '小组',
    objectArray: [],
    isHidePlaceholder: false,
    // 任务ID
    taskId:"",
    // 团队名称
    teamName:"",
    teamId:0,
    tixingTime:"",
    tixingTimeContent:"",
    isMsgRemind:0,
    phone:"",
    // 光标位置
    curos: 0,
    // 没插入#时的内容
    insertContent: "",
    // 内容分解
    contentJson:[],
    // 插入@人
    insertTeamMember:[],
    // 插入@人的Id
    atUserid:"",
    // 次数
    insertCount: 0,
    // 标题
    textName: "",
    currentWordNumber:"",
    textMax:200,
    hidden:true,
    nocancel:true,
    modalContent:"您已插入标题，请不要再次插入！",
    // 中心点纬度、经度
    latitude: "",
    longitude: "",
    locationJIUCount:0,
    locationXINCount:0,
    locationName:"",
    // 标记点 当前位置
    markers: [],    
    // 控件 回到当前位置

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("xiugaioptions=", options)
    this.getTeamList()
    var _this=this
    if (options && options.taskId) {
      this.setData({
        taskId: options.taskId
      })
      this.detailShijian()
    }
    var element = wx.createSelectorQuery()
    element.select(".detail-view").boundingClientRect(function(rec){
      _this.setData({
        height:rec.height+"px"
      })
      console.log("red=",rec)
    }).exec()
  },
  // 获取小组列表
  getTeamList:function () {
    var _this=this
    wx.getStorage({
      key: 'loginUser',
      success: function (res) {
        wx.request({
          url: app.globalData.server + '/apply',
          data: {
            router: "GET_GROUPS",
            memberType: ""
          },
          method: "post",
          header: {
            "token": res.data.token,
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(rest) {
            console.log("xilist=", res)
            var arrayList = []
            if (rest.data.code == 0 && rest.data.object.length > 0) {
              for (var i = 0; i < rest.data.object.length; i++) {
                var obj={}
                obj.id = rest.data.object[i].id
                obj.name = rest.data.object[i].groupName
                arrayList.push(obj)
              }
            }
            _this.setData({
              objectArray: arrayList
            })
            if (arrayList.length>0) {
              _this.setData({
                teamId:arrayList[0].id
              })
            }
            // console.log("objArray=",_this.data)
          }
        })
      },
    })
  },
  bindPickerChange:function (e) {
    var that=this
    console.log("xiaoz=",e.detail)
    this.setData({
      rangekey: e.detail.value,
      teamId: that.data.objectArray[e.detail.value].id,
      teamName: that.data.objectArray[e.detail.value].name
      // xiaozuName: this.data.objectArray[e.detail.value].name
    })
  },
  // 取消发送
  // alert: function () {
  //   var that = this
  //   wx.showModal({
  //     title: '提示',
  //     content: '直接关闭将导致内容无法保存',
  //     success(res) {
  //       if (res.confirm) {
  //         wx.navigateBack({
  //           url: '../index/index'
  //         })
  //       }
  //     }
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
    this.setData({ currentTab: e.detail.current });
  },


  // atUserid: atUserid,
  // phone: that.data.phone,
  // isMsgRemind: that.data.isMsgRemind,
  // taskId: that.data.taskId,
  // statuse: 0
  // that.data.locationName.concat(":", that.data.latitude, ",", that.data.longitude)
  // 事件详情
  detailShijian:function () {
    var _this=this
    wx.getStorage({
      key: 'detailShiJian',
      success: function(res) {
        var detial = res.data
        // var addresss=[]
        // if (detail.taskAddress) {
        //   addresss=detail.taskAddress.split(":")
        //   var lat=addresss[1].split(",")
        //   _this.setData({
        //     locationName: addresss[0],
        //     latitude: lat[0],
        //     longitude: lat[1],
        //   })
        // }
        // 地址 -只有一个地址的时候
        var address = []
        console.log(9696)
        console.log("ee=", detial.taskAddress)
        if (detial.taskAddress && detial.taskAddress.length>0) {
          address = detial.taskAddress.split(":")
          if (address.length>1){
            _this.setData({
              locationName: address[0],
              latitude: address[1].split(",")[0],
              longitude: address[1].split(",")[1]
            })
          }
         
        }
        var task=""
        var con = detial.taskCentent
        if (detial.taskTitle) {
          task = "#".concat(detial.taskTitle, "#")
          con = task.concat(detial.taskCentent)
        }else{
          task = detial.taskTitle
        }
        _this.setData({
          insertContent: con,
          textName:detial.taskTitle,
          tixingTimeContent: detial.showReminderTime ? detial.showReminderTime:"",
          currentWordNumber: con.length,
        })
      },
    })
  },
  // 字数
  inputText: function(e) {
    // console.log("e=",e)
    var that=this
    if (e && e.detail.value) {
      if (that.data.textName) {
        var jinhaocount=0;
        var lengthJinHao=e.detail.value.match(/\W/g)
        for (var i = 0; i<lengthJinHao.length; i++) {
          if (lengthJinHao[i]=="#") {
            jinhaocount++
          }
        }

        if (jinhaocount==1) {
          var shengyuJinHaoLocation=e.detail.value.indexOf("#")
          if (shengyuJinHaoLocation==0) {
            this.setData({
              insertContent: e.detail.value.slice(1),
              textName:"",
              hidden:true
              // curos:(that.data.curos-1)
            })
          } else {
            this.setData({
              insertContent: e.detail.value.slice(0, shengyuJinHaoLocation).concat(e.detail.value.slice(shengyuJinHaoLocation+1)),
              textName:"",
              hidden:true
            })
          }
        }
      }
    }
    if (e.detail.value.length<0) {
      this.setData({
        currentWordNumber:0
      })
    }else if (e.detail.value.length>200) {
      wx.showToast({
        title:"最多输入200字哟",
        icon: 'fail',
        duration: 3000,
      })
    } else {
      this.setData({
        currentWordNumber: e.detail.value.length,
        insertContent:e.detail.value,
        curos:e.detail.cursor
      })
    }
  },
  // textarea 输入时触发
  getTextareaInput: function (e) {
    console.log('ru=',e)
    var that=this
    var element = wx.createSelectorQuery()
    element.select(".detail-view").boundingClientRect(function (rec) {
      that.setData({
        height: rec.height + "px"
      })
      console.log("red=", rec)
    }).exec()
  },
  // 光标指出时触发
  getTextareaOut: function (e) {
    var that = this
    console.log('out=', e.detail)
    console.log("data=",this.data)
  },
  // 插入符号
  insertSymbol: function () {
    var that = this
    console.log(this.data)
    if (that.data.textName) {
      this.setData({
        hidden:false
      })
      return
    }
    // console.log('this=', this.data.insertContent)
    // console.log('this2=',this.data.xiaozuName)
    // console.log('that=', that.data)
    // console.log('that=', that.data["insertContent"])
    if (that.data.insertContent.match(/#([\s\S]*)#/) && that.data.insertContent.match(/#([\s\S]*)#/).length > 0) {
      // 标题已经选中
      // console.log("标题已选中")
      // this.setData({

      // })
    } else {
      // console.log('st=', this.data.insertContent)
      // console.log('text=',that.data.insertContent.slice(0, that.data.curos))
      this.setData({
        curos:that.data.curos+2,
        textName: that.data.insertContent.slice(0, that.data.curos),
        insertContent: "#".concat(that.data.insertContent.slice(0, that.data.curos), "#", that.data.insertContent.slice(that.data.curos))
      })
      console.log("charuhou=",this.data)

    }
    this.setData({
      insertCount: ++that.data.insertCount
    })
  },
  // 弹框确定取消
  cancel: function () {
    this.setData({
      hidden: true
    });
  },
  confirm: function () {
    this.setData({
      hidden:true
    });
  },
  // 获取时间
  getTime: function () {
    wx.navigateTo({
      url:"../../pages/time/time?",
    })
  },
  // 获取当前地理位置
  locationClick: function (e) {
    var thisBlock = this
    wx.getLocation({
      type: "wgs84",
      success: function(res){
        console.log("loca=",res)
        thisBlock.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [{
            iconPath: "",
            id: 0,
            latitude: res.latitude,
            longitude: res.longitude,
            width:35,
            height:35,
            title: "当前位置",
            callout: {
              padding: 0,
              content: "当前位置",
              bgColor: "#DC143C",
              color: "#FFFF00",
              display:"ALWAYS"
            }
          }]
        })
      }
    })
    // 设定位置
    // console.log('thisBlock=', thisBlock.data)
    wx.chooseLocation({
      success: function (res) {
        // console.log('location=',res)
        if (res.address) {
          thisBlock.setData({
            latitude: res.latitude,
            longitude: res.longitude,
            locationName: res.name,
            locationXINCount: thisBlock.data.locationJIUCount + 1,
            insertContent: thisBlock.data.insertContent.concat("「", res.name, "」"),
            curos: thisBlock.data.curos + res.name.length + 2
          })
        } else {
          wx.showToast({
            title: '请选择地址',
          })
        }

      }
    })
  },
  // regionchange: function () {
  //   var that = this
  //   console.log(999)
  //   wx.getLocation({
  //     type: "wgs84",
  //     success: function(res){
  //       that.setData({
  //         latitude: res.latitude,
  //         longitude: res.longitude,
  //         markers: [{
  //           iconPath: "/images/map/address.png",
  //           id: 0,
  //           latitude: res.latitude,
  //           longitude: res.longitude,
  //           width: 35,
  //           height: 35,
  //           title: "当前位置",
  //           callout: {
  //             padding: 10,
  //             content: "当前位置",
  //             bgColor: "#DC143C",
  //             color: "#FFFF00",
  //             display: "ALWAYS"
  //           },
  //           label: { content: "标题" },
  //           anchor: {}
  //         }],
  //       })
  //     }
  //   })
  // },
  // 回到当前位置
  controlClick: function (res) {
    var thisBlock = this;

    wx.getLocation({
      type: "wgs84",
      success: function (res) {
        console.log(res);

        thisBlock.setData({
          latitude: res.latitude,
          longitude: res.longitude,

          markers: [{
            iconPath: "",
            id: 0,
            latitude: res.latitude,
            longitude: res.longitude,
            width: 35,
            height: 35,
            title: "当前位置",
            callout: {
              padding: 10,
              content: "当前位置",
              bgColor: "#DC143C",
              color: "#FFFF00",
              display: "ALWAYS"
            },
            label: { content: "标题" },
            anchor: {}
          }],
        })
      },
    })
  },
  // 发布
  sendMessage: function () {
    wx.showToast({
      title: '请求中..',
      mask:true
    })
    var that=this
    console.log('lod=',that.data)
    // console.log('that.data.insertContent=', that.data.insertContent)
    if (!that.data.insertContent) {
      // wx.showToast({
      //   title: '请输入内容',
      // })
      wx.showModal({
        title: '提示',
        content: '请输入内容',
        showCancel:false
      })
      return
    }
    that.sliceContent(that.data.insertContent)
    // wx.request({
    //   url: 'https://api.weixin.qq.com/cgi-bin/token',
    //   method: 'GET',
    //   data: {
    //     grant_type: 'client_credential',
    //     appid: 'wx946a1c0c331b0200',
    //     secret: 'a6cf9b5c2209174fc41b6634262a9281 '
    //   },
    //   success(res) {
    //     wx.request({
    //       url: 'https://api.weixin.qq.com/wxa/msg_sec_check?access_token=' + res.data,
    //       method: 'POST',
    //       data: {
    //         content: that.data.content
    //       },
    //       success(re) {
            // if (re.errcode === 87014) {
            //   wx.showModal({
            //     title: '友情提示',
            //     content: '内容含有敏感字',
            //   })
            // } else {
              wx.getStorage({
                key: 'loginUser',
                success: function (res) {
                  var groupId = 0
                  if (that.data.currentTab==0) {
                    groupId = res.data.privateGroup
                  } else {
                    if (that.data.teamId) {
                      groupId = that.data.teamId
                    } else {

                      wx.showModal({
                        title: '提示',
                        content: '暂无小组，请先创建小组',
                        showCancel:false
                      })
                      return
                    }
                  }
                  var addres = ""
                  if (that.data.locationName) {
                    addres = that.data.locationName.concat(":", that.data.latitude, ",", that.data.longitude)
                  }
                  var atUserid=""
                  if (that.data.atUserid) {
                    atUserid = that.data.atUserid
                  }
                  // 内容
                  var taskcontent=""
                  if (that.data.insertContent && that.data.textName) {
                    taskcontent = that.data.insertContent.slice(that.data.insertContent.indexOf("#".concat(that.data.textName),"#") + that.data.textName.length+2)
                    console.log("takcont=", taskcontent)
                    console.log("inde=", that.data.insertContent.indexOf(that.data.textName))
                  }else{
                    taskcontent = that.data.insertContent
                  }
                  // 修改
                  if (that.data.taskId) {
                    wx.request({
                      url: app.globalData.server + '/apply',
                      data:{
                        router:"EDIT_TASK",
                        taskCentent: taskcontent,
                        reminderTime: that.data.tixingTime,
                        taskTitle: that.data.textName,
                        taskAddress: addres,
                        atUserid: atUserid,
                        phone: that.data.phone,
                        isMsgRemind: that.data.isMsgRemind,
                        taskId:that.data.taskId,
                        statuse:0,
                        userJson: that.data.insertTeamMember.join(","),
                        contentJson: that.data.contentJson
                      },
                      method: "post",
                      header: {
                        "token": res.data.token,
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      success(res) {
                        wx.hideLoading()
                        if (res.data.code==0) {
                          wx.navigateBack({
                            delta: 2
                          })
                        } else {
                          wx.showModal({
                            title: '提示',
                            content: res.data.message,
                            showCancel: false
                          })
                        }
                      },
                      fail(err) {
                        wx.hideLoading()
                      }
                    })
                  }else{
                    wx.request({
                      url: app.globalData.server + '/apply',
                      data: {
                        router: "PUSH_TASK",
                        groupId: groupId,
                        taskCentent: taskcontent,
                        reminderTime: that.data.tixingTime,
                        taskTitle: that.data.textName,
                        taskAddress: addres,
                        atUserid: atUserid,
                        phone: that.data.phone,
                        isMsgRemind: that.data.isMsgRemind,
                        userJson: that.data.insertTeamMember.join(","),
                        contentJson: that.data.contentJson
                      },
                      method: "post",
                      header: {
                        "token": res.data.token,
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      success(res) {
                        // console.log("res=", res)
                        wx.hideLoading()
                        if (res.data.code == 0) {
                          wx.navigateBack({
                            delta: 1
                          })
                        }else{
                          wx.showModal({
                            title: '提示',
                            content: res.data.message,
                            showCancel:false
                          })
                        }
                      },
                      fail(err) {
                        wx.hideLoading()
                      }
                    })
                  }
                },
              })
            // }
          // }
        // })
      // }
    // })
    
  },
  // 分割内容
  sliceContent:function (content) {
    var that=this
    var contentJson=[]
    var textName = that.data.textName
    // 查找标题
    var titleLocation = content.indexOf(textName)
    // @人的位置
    var allmans=content.split("@")
    console.log("allmans=",allmans)
    // 人的全名
    var man=""
    // 人的起始位置
    var startLocationman=0
    // 人的结束位置
    var endLocationman=0
    // console.log("insertTeamMember=", that.data.insertTeamMember)
    for (var i=0;i<allmans.length;i++) {
      var allman=allmans[i].split(";")
      console.log("allman=",allman)
      man="@".concat(allman[0],";")
      // console.log("man=",man)
      // console.log("ddt=", that.data.insertTeamMember.toString().indexOf(man))
      // console.log("st=", allman.length > 1)
      // console.log("dt=", that.data.insertTeamMember.indexOf(man) >=0)
      if(allman.length>1){
        if (that.data.insertTeamMember.toString().indexOf(man) >=0) {
          contentJson.push("@".concat(allman[0], ";"))
          if (allman[1]!=""){
            contentJson.push(allman[1])
          }
          
        }
      }else{
        contentJson.push(allman[0])
      }

    }
    console.log("contentJSON=", contentJson)
    var dizhicontentJson=[]
    var firstloction=""
    var lastloction=""
    // 地址位置
    var location = "「".concat(that.data.locationName, "」")
    // 地址长度
    var locationLength=location.length
    var locationN = 0
    console.log("location=", location)
    console.log("leng=",location.length)
    for (var i=0;i<contentJson.length;i++) {
      locationN = contentJson[i].toString().indexOf(location)
      console.log("locationN=", locationN)
      if (locationN>-1){
        firstloction=contentJson[i].slice(0, locationN)
        lastloction=contentJson[i].slice(locationN + locationLength)
        if (firstloction!="") {
          dizhicontentJson.push(firstloction)
        }
        dizhicontentJson.push(location)
        if (lastloction!="") {
          dizhicontentJson.push(lastloction)
        }
      }else{
        dizhicontentJson.push(contentJson[i])
      }
    }
    // #测试#敏添@666666;@666666;@米饭;到「江北区人民政府」和@一粟;一起
    console.log("dizhicontentJson=", dizhicontentJson)
    that.setData({
      contentJson: dizhicontentJson
    })

  },
  // 点击发布的同时传递formId
  submitInfo:function (e) {
    console.log("eeee=",e)
    this.sendMessage()
    console.log("formID=", e.detail.formId)
    this.setFormId(e.detail.formId)
  },
  // formID
  setFormId:function (formID) {
    wx.getStorage({
      key: 'loginUser',
      success: function(res) {
        // formId
        wx.request({
          url: app.globalData.server + '/apply',
          data: {
            formIds: formID,
            router: "SAVE_FORMIDS"
          },
          method: "post",
          header: {
            "token": res.data.token,
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(re) {
            console.log("re=", re)
          }
        })
      },
    })
  },
  insertTeamMember:function() {
    if (!this.data.teamId) {
      wx.showModal({
        title: '提示',
        content: '暂无小组，请先创建小组',
        showCancel:false
      })
      return
    }
    wx.navigateTo({
      url: '../../pages/teamMember/teamMember?teamId='+this.data.teamId,
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
      title: '发布事情',
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#FFFFFF',
    })
    // wx.setStorage({
    //   key: 'aShow',
    //   data: true,
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