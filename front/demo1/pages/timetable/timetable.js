// 在timetable.js顶部添加（无需引用外部文件）
// 替换你的hexMD5函数为以下完整版本
function hexMD5(str, salt) {
    const input = salt ? str + salt : str;
  
    // MD5核心实现（完整代码，不可省略）
    function md5Cycle(x, k) {
      let a = x[0], b = x[1], c = x[2], d = x[3];
      a = ff(a, b, c, d, k[0], 7, -680876936);
      d = ff(d, a, b, c, k[1], 12, -389564586);
      c = ff(c, d, a, b, k[2], 17, 606105819);
      b = ff(b, c, d, a, k[3], 22, -1044525330);
      a = ff(a, b, c, d, k[4], 7, -176418897);
      d = ff(d, a, b, c, k[5], 12, 1200080426);
      c = ff(c, d, a, b, k[6], 17, -1473231341);
      b = ff(b, c, d, a, k[7], 22, -45705983);
      a = ff(a, b, c, d, k[8], 7, 1770035416);
      d = ff(d, a, b, c, k[9], 12, -1958414417);
      c = ff(c, d, a, b, k[10], 17, -42063);
      b = ff(b, c, d, a, k[11], 22, -1990404162);
      a = ff(a, b, c, d, k[12], 7, 1804603682);
      d = ff(d, a, b, c, k[13], 12, -40341101);
      c = ff(c, d, a, b, k[14], 17, -1502002290);
      b = ff(b, c, d, a, k[15], 22, 1236535329);
      a = gg(a, b, c, d, k[1], 5, -165796510);
      d = gg(d, a, b, c, k[6], 9, -1069501632);
      c = gg(c, d, a, b, k[11], 14, 643717713);
      b = gg(b, c, d, a, k[0], 20, -373897302);
      a = gg(a, b, c, d, k[5], 5, -701558691);
      d = gg(d, a, b, c, k[10], 9, 38016083);
      c = gg(c, d, a, b, k[15], 14, -660478335);
      b = gg(b, c, d, a, k[4], 20, -405537848);
      a = gg(a, b, c, d, k[9], 5, 568446438);
      d = gg(d, a, b, c, k[14], 9, -1019803690);
      c = gg(c, d, a, b, k[3], 14, -187363961);
      b = gg(b, c, d, a, k[8], 20, 1163531501);
      a = gg(a, b, c, d, k[13], 5, -1444681467);
      d = gg(d, a, b, c, k[2], 9, -51403784);
      c = gg(c, d, a, b, k[7], 14, 1735328473);
      b = gg(b, c, d, a, k[12], 20, -1926607734);
      a = hh(a, b, c, d, k[5], 4, -378558);
      d = hh(d, a, b, c, k[8], 11, -2022574463);
      c = hh(c, d, a, b, k[11], 16, 1839030562);
      b = hh(b, c, d, a, k[14], 23, -35309556);
      a = hh(a, b, c, d, k[1], 4, -1530992060);
      d = hh(d, a, b, c, k[4], 11, 1272893353);
      c = hh(c, d, a, b, k[7], 16, -155497632);
      b = hh(b, c, d, a, k[10], 23, -1094730640);
      a = hh(a, b, c, d, k[13], 4, 681279174);
      d = hh(d, a, b, c, k[0], 11, -358537222);
      c = hh(c, d, a, b, k[3], 16, -722521979);
      b = hh(b, c, d, a, k[6], 23, 76029189);
      a = hh(a, b, c, d, k[9], 4, -640364487);
      d = hh(d, a, b, c, k[12], 11, -421815835);
      c = hh(c, d, a, b, k[15], 16, 530742520);
      b = hh(b, c, d, a, k[2], 23, -995338651);
      a = ii(a, b, c, d, k[0], 6, -198630844);
      d = ii(d, a, b, c, k[7], 10, 1126891415);
      c = ii(c, d, a, b, k[14], 15, -1416354905);
      b = ii(b, c, d, a, k[5], 21, -57434055);
      a = ii(a, b, c, d, k[12], 6, 1700485571);
      d = ii(d, a, b, c, k[3], 10, -1894986606);
      c = ii(c, d, a, b, k[10], 15, -1051523);
      b = ii(b, c, d, a, k[1], 21, -2054922799);
      a = ii(a, b, c, d, k[8], 6, 1873313359);
      d = ii(d, a, b, c, k[15], 10, -30611744);
      c = ii(c, d, a, b, k[6], 15, -1560198380);
      b = ii(b, c, d, a, k[13], 21, 1309151649);
      a = ii(a, b, c, d, k[4], 6, -145523070);
      d = ii(d, a, b, c, k[11], 10, -1120210379);
      c = ii(c, d, a, b, k[2], 15, 718787259);
      b = ii(b, c, d, a, k[9], 21, -343485551);
      x[0] = add32(a, x[0]);
      x[1] = add32(b, x[1]);
      x[2] = add32(c, x[2]);
      x[3] = add32(d, x[3]);
    }
    function cmn(q, a, b, x, s, t) {
      a = add32(add32(a, q), add32(x, t));
      return add32(rol(a, s), b);
    }
    function ff(a, b, c, d, x, s, t) { return cmn((b & c) | (~b & d), a, b, x, s, t); }
    function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & ~d), a, b, x, s, t); }
    function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
    function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | ~d), a, b, x, s, t); }
    function add32(a, b) { return (a + b) & 0xFFFFFFFF; }
    function rol(num, cnt) { return (num << cnt) | (num >>> (32 - cnt)); }
    function str2binl(str) {
      const bin = [];
      const len = str.length * 8;
      for (let i = 0; i < len; i += 8) {
        bin[i >> 5] |= (str.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
      }
      return bin;
    }
    function binl2hex(binarray) {
      const hexTab = '0123456789abcdef';
      let str = '';
      for (let i = 0; i < binarray.length * 4; i++) {
        str += hexTab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
          hexTab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
      }
      return str;
    }
    function coreMD5(str) {
      const x = str2binl(str);
      const k = [0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501, 0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821, 0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8, 0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a, 0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70, 0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665, 0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1, 0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391];
      let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;
      const len = x.length * 32;
      x[len >> 5] |= 0x80 << (24 - len % 32);
      x[((len + 64) >>> 9 << 4) + 14] = len;
      for (let i = 0; i < x.length; i += 16) {
        const olda = a, oldb = b, oldc = c, oldd = d;
        md5Cycle([a, b, c, d], x.slice(i, i + 16), k);
        a = add32(a, olda);
        b = add32(b, oldb);
        c = add32(c, oldc);
        d = add32(d, oldd);
      }
      return [a, b, c, d];
    }
    return binl2hex(coreMD5(input));
  }
  
  // 新增：Cookie合并工具函数（去重并保留最新有效Cookie）
  function mergeCookies(existingCookies, newCookies) {
    // 分割Cookie为键值对数组（过滤空值）
    const existing = existingCookies.split(';').map(item => item.trim()).filter(Boolean);
    const newItems = newCookies.split(';').map(item => item.trim()).filter(Boolean);
    const cookieMap = new Map();
  
    // 先添加现有Cookie（旧值）
    existing.forEach(item => {
      const [key, value] = item.split('=').map(p => p.trim());
      cookieMap.set(key, value);
    });
  
    // 再添加新Cookie（新值覆盖旧值）
    newItems.forEach(item => {
      const [key, value] = item.split('=').map(p => p.trim());
      cookieMap.set(key, value);
    });
  
    // 过滤空值Cookie（如JSESSIONID=;），只保留有效键值对
    const validCookies = [];
    cookieMap.forEach((value, key) => {
      if (value) { // 排除值为空的Cookie
        validCookies.push(`${key}=${value}`);
      }
    });
  
    return validCookies.join('; ');
  }
  
  var jwxtApi = {
    baseUrl: 'https://jwxs.hebut.edu.cn', // 修正：去掉多余斜杠，避免URL拼接错误
    cookies: '',
  
    // 提取token方法（优化正则）
    extractToken: function(html) {
      // 更宽松的正则：忽略id属性，只匹配name和value（兼容更多HTML结构）
      const regex = /<input[^>]*?name=["']tokenValue["'][^>]*?value=["']([^"']+)["']/i;
      const match = html.match(regex);
      const tokenValue = match ? match[1] : null;
      
      if (tokenValue) {
        console.log('提取到tokenValue：', tokenValue);
      } else {
        console.error('未找到tokenValue，登录页HTML片段：', html.substring(0, 500));
      }
      return tokenValue;
    },
  
    // 获取验证码（使用Cookie合并函数，添加浏览器UA）
    getCaptcha: function() {
        const that = this;
        return new Promise((resolve, reject) => {
          const url = `${that.baseUrl}/img/captcha.jpg`; // 用第一步确认的正确路径
          console.log('验证码请求URL：', url); // 确认URL是否正确
      
          wx.request({
            url: url,
            method: 'GET',
            responseType: 'arraybuffer',
            header: {
              'Referer': `${that.baseUrl}/login`,
              'Cookie': that.cookies
            },
            success: (res) => {
              // 合并Cookie（不变）
              if (res.header['Set-Cookie']) {
                that.cookies = res.header['Set-Cookie']; // 直接覆盖，保留最新Cookie
                console.log('当前Cookie：', that.cookies);
              }
              // 关键：必须返回base64格式的图片URL
              const base64 = wx.arrayBufferToBase64(res.data);
              const imgUrl = `data:image/jpeg;base64,${base64}`; // 正确的图片路径格式
              console.log('验证码图片URL：', imgUrl); // 应输出类似data:image/jpeg;base64,...
              resolve(imgUrl); // 传递正确的URL
            },
            fail: (err) => {
              reject(`验证码请求失败：${err.errMsg}`);
            }
          });
        });
      },
  
    // 登录方法（优化Cookie合并和请求头）
    login: function(studentId, password, captcha) {
      const that = this;
      return new Promise((resolve, reject) => {
        // 步骤1：请求登录页
        wx.request({
          url: `${that.baseUrl}/login`,
          method: 'GET',
          header: {
            'Referer': that.baseUrl,
            'Cookie': that.cookies
          },
          success: (loginPageRes) => {
            // 合并登录页返回的Cookie
            if (loginPageRes.header['Set-Cookie']) {
              that.cookies = mergeCookies(that.cookies, loginPageRes.header['Set-Cookie']);
              console.log('登录页合并后Cookie：', that.cookies);
            }
  
            const tokenValue = that.extractToken(loginPageRes.data);
            if (!tokenValue) {
              reject('提取token失败');
              return;
            }
  
            // 步骤2：发送登录请求
            wx.request({
              url: `${that.baseUrl}/loginCheck`,
              method: 'POST',
              header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': that.cookies,
                'Referer': `${that.baseUrl}/login`,
              },
              data: {
                j_username: studentId,
                j_password: password,
                j_captcha: captcha,
                tokenValue: tokenValue
              },
              // 在jwxtApi.login的登录请求success回调中修改
success: (res) => {
    console.log('登录响应状态码：', res.statusCode);
    console.log('登录响应头Location：', res.header.Location);
    console.log('登录响应数据（前500字符）：', res.data.substring(0, 500));
    
    // 1. 补充变量定义（关键修复）
    const responseData = typeof res.data === 'string' ? res.data : '';
    const isLoginPage = responseData.includes('j_username'); // 是否仍在登录页（失败特征）
    const locationHeader = typeof res.header.Location === 'string' ? res.header.Location : '';
    const isRedirectToHome = locationHeader.includes('/main') || locationHeader.includes('/home'); // 成功特征
    
    // 2. 正确判断登录成功
    const isSuccess = (res.statusCode === 302 && isRedirectToHome) || !isLoginPage;
    console.log('登录成功判断结果：', isSuccess);
    resolve(isSuccess);
  },
              fail: (err) => {
                reject(`登录请求失败：${err.errMsg}`);
              }
            });
          },
          fail: (err) => {
            reject(`获取登录页失败：${err.errMsg}`);
          }
        });
      });
    }
  };
  
  // 页面登录逻辑
  Page({
    data: {
      studentId: '',
      password: '',
      captcha: '',
      captchaImg: ''
    },
  
    onLoad: function() {
      this.refreshCaptcha();
    },
  
    // 刷新验证码
    refreshCaptcha: function() {
      jwxtApi.getCaptcha().then(imgUrl => {
        this.setData({ captchaImg: imgUrl });
      }).catch(err => {
        wx.showToast({ title: '验证码加载失败', icon: 'none' });
        console.error(err);
      });
    },
  
    // 登录按钮点击事件（修正验证码处理顺序）
    login: function() {
      const { studentId, password, captcha } = this.data;
      if (!studentId || !password || !captcha) {
        wx.showToast({ title: '请填写完整信息', icon: 'none' });
        return;
      }
  
      // 1. 验证码转为大写（部分系统区分大小写）
      const captchaUpper = captcha.toUpperCase();
      // 2. 密码加密
      const md5Pwd1 = hexMD5(password);
      const md5Pwd2 = hexMD5(password, '1.8');
      // 替换密码加密部分
const encryptedPassword = hexMD5(password); // 仅一次MD5加密
      console.log('加密后密码：', encryptedPassword);
      console.log('处理后验证码：', captchaUpper);
  
      wx.showLoading({ title: '登录中...' });
      // 3. 传入处理后的验证码
      jwxtApi.login(studentId, encryptedPassword, captchaUpper)
        .then(success => {
          wx.hideLoading();
          if (success) {
            wx.showToast({
              title: '登录成功，跳转中...',
              icon: 'success',
              duration: 1500
            });
            setTimeout(() => {
              wx.navigateTo({
                url: '/pages/webside/webside', // 确保此页面已在app.json注册
                fail: (err) => {
                  console.error('跳转失败：', err);
                  wx.showToast({ title: '跳转失败，请重试', icon: 'none' });
                }
              });
            }, 1500);
          } else {
            wx.showToast({ title: '账号/密码/验证码错误', icon: 'none' });
            this.refreshCaptcha();
          }
        })
        .catch(err => {
          wx.hideLoading();
          wx.showToast({ title: '登录异常，请重试', icon: 'none' });
          console.error('登录错误：', err);
        });
    },
  
    // 输入事件处理
    onStudentIdInput: function(e) {
      this.setData({ studentId: e.detail.value });
    },
    onPasswordInput: function(e) {
      this.setData({ password: e.detail.value });
    },
    onCaptchaInput: function(e) {
      this.setData({ captcha: e.detail.value });
    }
  });