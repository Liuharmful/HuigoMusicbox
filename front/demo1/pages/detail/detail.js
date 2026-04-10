// pages/detail/detail.js
Page({
    data: {
      link: ""  // 存储要加载的链接
    },

    // 列表页中跳转详情页的代码
onJobClick(detailLink) {
    // 对链接进行编码，避免特殊字符导致URL错误
    const encodedLink = encodeURIComponent(detailLink);
    wx.navigateTo({
      url: `/pages/detail/detail?link=${encodedLink}`
    });
  },



    onLoad(options) {
      // 解析传递过来的链接（用decodeURIComponent还原）
      const link = decodeURIComponent(options.link);
      this.setData({ link });
    },



    onWebViewError(e) {
        wx.showToast({
          title: '页面加载失败',
          icon: 'none'
        });
        console.error('web-view加载错误：', e.detail);
      },
      onWebViewLoad() {
        console.log('页面加载成功');
      }




  }); 