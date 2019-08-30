const app = getApp()
Component({
  properties: {
    chengyuantouxiang: {
      type:String,
      value:""
    },
    nicheng: {
      type:String,
      value:""
    },
    guanlianNum: {
      type:Number,
      value:0
    },
    memberId:{
      type:Number,
      value:0
    }
  },
  data: {
    showModal: false
  },
  methods: {
    // 外面的弹框
    btn: function () {
      this.setData({
        showModal: true
      })
    },
    cancel: function () {
      this.setData({
        showModal:false
      })
    },
    tiaozhuanGuanlian:function () {
      wx.navigateTo({
        url: '../../pages/guanlian/guanlian?memberId=' + this.data.memberId + "&nicheng=" + this.data.nicheng,
      })
      
    },
    // 禁止屏幕滚动
    preventTouchMove: function () {

    }
  }
})
