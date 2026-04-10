// pages/index/index.js
Page({




    goToHebutweb() {
      wx.navigateTo({
        url: '/pages/webview/webview'
      })
    },




    goToJobs() {

        wx.navigateTo({
          url: '/pages/jobs/jobs' 
        })
      },





   data: {
    
  },
  onLoad() {
    
  },

  
  goToEmploymentCenter() {
    const url = 'https://hebut.jiuyeqiao.cn/'
    wx.navigateTo({
      url: `/pages/web1/web1?url=${encodeURIComponent(url)}`,
      success(res) {
        console.log('跳转到网页成功', res)
      },
      fail(err) {
        console.error('跳转到网页失败', err)
        // 如果跳转失败，可以尝试直接打开网页
        wx.openUrl({
          url: url,
          success(res) {
            console.log('直接打开网页成功', res)
          },
          fail(err2) {
            console.error('直接打开网页也失败', err2)
            wx.showToast({
              title: '跳转失败，请稍后再试',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  }











  })