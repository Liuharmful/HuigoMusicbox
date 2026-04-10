// pages/detail/detail.js
Page({
  data: {
    link: '',
    isLoading: true,
    hasError: false
  },

  onLoad(options) {
    if (options.link) {
      const link = decodeURIComponent(options.link);
      this.setData({ 
        link,
        isLoading: false
      });
    } else {
      this.setData({
        hasError: true,
        isLoading: false
      });
      wx.showToast({
        title: '链接无效',
        icon: 'none'
      });
    }
  },

  onWebViewError(e) {
    console.error('web-view 加载错误:', e.detail);
    this.setData({ hasError: true });
    wx.showToast({
      title: '页面加载失败',
      icon: 'none'
    });
  },

  onWebViewLoad() {
    console.log('页面加载成功');
    this.setData({ isLoading: false, hasError: false });
  },

  onRetry() {
    this.setData({
      hasError: false,
      isLoading: true
    });
  },

  onShareAppMessage() {
    return {
      title: '职位详情',
      path: `/pages/detail/detail?link=${encodeURIComponent(this.data.link)}`
    };
  }
});
