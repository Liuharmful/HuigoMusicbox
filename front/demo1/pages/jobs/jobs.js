// 就业信息页 jobs.js
Page({
  data: {
    jobList: [],
    loading: true,
    error: '',
    hasData: false
  },

  onLoad() {
    this.fetchJobs();
  },

  onPullDownRefresh() {
    this.fetchJobs();
  },

  fetchJobs() {
    const that = this;
    wx.request({
      url: 'http://hebutemploy.site/api/jobs',
      method: 'GET',
      timeout: 10000,
      success(res) {
        if (res.statusCode === 200 && res.data && res.data.success) {
          that.setData({
            jobList: res.data.data || [],
            loading: false,
            error: '',
            hasData: true
          });
        } else {
          that.setData({
            error: res.data?.error || '数据加载失败',
            loading: false
          });
        }
      },
      fail(err) {
        console.error('请求失败:', err);
        that.setData({
          error: '网络异常，请检查网络连接',
          loading: false
        });
      },
      complete() {
        wx.stopPullDownRefresh();
      }
    });
  },

  onRetry() {
    this.setData({
      loading: true,
      error: ''
    });
    this.fetchJobs();
  },

  goToDetail(e) {
    const link = e.currentTarget.dataset.link;
    if (!link) {
      wx.showToast({
        title: '链接不存在',
        icon: 'none'
      });
      return;
    }
    wx.navigateTo({
      url: `/pages/detail/detail?link=${encodeURIComponent(link)}`,
      fail: () => {
        wx.showToast({
          title: '跳转失败',
          icon: 'none'
        });
      }
    });
  }
});
