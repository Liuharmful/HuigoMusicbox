// pages/index/index.js
Page({
  data: {
    // 页面数据
  },

  onLoad() {
    console.log('首页加载完成');
  },

  /**
   * 跳转到河北工业大学官网
   */
  goToHebutweb() {
    wx.navigateTo({
      url: '/pages/webview/webview',
      fail: () => {
        wx.showToast({
          title: '页面不存在',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 跳转到招聘信息页
   */
  goToJobs() {
    wx.navigateTo({
      url: '/pages/jobs/jobs',
      fail: () => {
        wx.showToast({
          title: '页面不存在',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 跳转到就业中心
   */
  goToEmploymentCenter() {
    const url = 'https://hebut.jiuyeqiao.cn/';
    wx.navigateTo({
      url: `/pages/web1/web1?url=${encodeURIComponent(url)}`,
      success: (res) => {
        console.log('跳转到网页成功', res);
      },
      fail: (err) => {
        console.error('跳转到网页失败', err);
        wx.showToast({
          title: '跳转失败，请稍后再试',
          icon: 'none',
          duration: 2000
        });
      }
    });
  }
});
