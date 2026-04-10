// pages/web1/web1.js
Page({
    data: {
      url: ''
    },
    onLoad(options) {
      // 接收传递过来的URL参数
      if (options.url) {
        this.setData({
          url: decodeURIComponent(options.url)
        })
      } else {
        // 如果没有URL参数，显示错误信息
        wx.showToast({
          title: '参数错误，无法加载页面',
          icon: 'none',
          duration: 2000
        })
        // 返回上一页
        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      }
    },
    // 网页加载成功
    onWebviewLoad(e) {
      console.log('网页加载成功', e)
      // 可以在这里添加加载成功的处理逻辑
    },
    // 网页加载失败
    onWebviewError(e) {
      console.error('网页加载失败', e)
      wx.showToast({
        title: '网页加载失败，请稍后再试',
        icon: 'none',
        duration: 2000
      })
      // 返回上一页
      setTimeout(() => {
        wx.navigateBack()
      }, 2000)
    }
  })