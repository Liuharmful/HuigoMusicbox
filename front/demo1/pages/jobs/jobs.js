// 就业信息页 jobs.js
Page({
        data: {
          jobList: [],  // 存储招聘信息列表
          loading: true, // 加载状态
          error: ""      // 错误信息
        },
      
        onLoad() {
          // 页面加载时请求后端数据
          this.fetchJobs();
        },
      
        // 调用后端接口获取招聘信息
        fetchJobs() {
          const that = this;
          wx.request({
            url: "http://hebutemploy.site/api/jobs", // 替换为你的后端接口地址
            method: "GET",
            success(res) {
              if (res.data.success) {
                // 请求成功，更新数据
                that.setData({
                  jobList: res.data.data,
                  loading: false
                });
              } else {
                // 后端返回错误
                that.setData({
                  error: res.data.error,
                  loading: false
                });
              }
            },
            fail(err) {
              // 请求失败（如网络错误）
              that.setData({
                error: "获取数据失败，请检查网络",
                loading: false
              });
              console.error("请求失败：", err);
            }
          });
        },


        // 点击招聘信息跳转到详情（可选，需配置web-view）
        goToDetail(e) 
        {
            // 获取当前点击项的链接（从data-link中提取）
            const link = e.currentTarget.dataset.link;
            if (!link) {
              wx.showToast({
                title: '链接不存在',
                icon: 'none'
              });
              return;
            }

            wx.navigateTo({
                url: `/pages/detail/detail?link=${encodeURIComponent(link)}`
              });

        }
  });
