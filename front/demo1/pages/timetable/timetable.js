// timetable.js - 教务系统登录页
const jwxtApi = {
  baseUrl: 'https://jwxs.hebut.edu.cn',
  cookies: '',

  extractToken(html) {
    const regex = /<input[^>]*?name=["']tokenValue["'][^>]*?value=["']([^"']+)["']/i;
    const match = html.match(regex);
    const tokenValue = match ? match[1] : null;
    
    if (tokenValue) {
      console.log('提取到 tokenValue:', tokenValue);
    } else {
      console.error('未找到 tokenValue');
    }
    return tokenValue;
  },

  mergeCookies(existingCookies, newCookies) {
    const existing = existingCookies.split(';').map(item => item.trim()).filter(Boolean);
    const newItems = newCookies.split(';').map(item => item.trim()).filter(Boolean);
    const cookieMap = new Map();

    existing.forEach(item => {
      const [key, value] = item.split('=').map(p => p.trim());
      cookieMap.set(key, value);
    });

    newItems.forEach(item => {
      const [key, value] = item.split('=').map(p => p.trim());
      cookieMap.set(key, value);
    });

    const validCookies = [];
    cookieMap.forEach((value, key) => {
      if (value) {
        validCookies.push(`${key}=${value}`);
      }
    });

    return validCookies.join('; ');
  },

  getCaptcha() {
    const that = this;
    return new Promise((resolve, reject) => {
      const url = `${that.baseUrl}/img/captcha.jpg`;
      
      wx.request({
        url,
        method: 'GET',
        responseType: 'arraybuffer',
        header: {
          Referer: `${that.baseUrl}/login`,
          Cookie: that.cookies
        },
        success: (res) => {
          if (res.header['Set-Cookie']) {
            that.cookies = res.header['Set-Cookie'];
            console.log('当前 Cookie:', that.cookies);
          }
          const base64 = wx.arrayBufferToBase64(res.data);
          const imgUrl = `data:image/jpeg;base64,${base64}`;
          resolve(imgUrl);
        },
        fail: (err) => {
          reject(`验证码请求失败：${err.errMsg}`);
        }
      });
    });
  },

  login(studentId, password, captcha) {
    const that = this;
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${that.baseUrl}/login`,
        method: 'GET',
        header: {
          Referer: that.baseUrl,
          Cookie: that.cookies
        },
        success: (loginPageRes) => {
          if (loginPageRes.header['Set-Cookie']) {
            that.cookies = this.mergeCookies(that.cookies, loginPageRes.header['Set-Cookie']);
          }

          const tokenValue = this.extractToken(loginPageRes.data);
          if (!tokenValue) {
            reject('提取 token 失败');
            return;
          }

          wx.request({
            url: `${that.baseUrl}/loginCheck`,
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Cookie: that.cookies,
              Referer: `${that.baseUrl}/login`
            },
            data: {
              j_username: studentId,
              j_password: password,
              j_captcha: captcha,
              tokenValue
            },
            success: (res) => {
              console.log('登录响应状态码:', res.statusCode);
              const responseData = typeof res.data === 'string' ? res.data : '';
              const isLoginPage = responseData.includes('j_username');
              const locationHeader = typeof res.header.Location === 'string' ? res.header.Location : '';
              const isRedirectToHome = locationHeader.includes('/main') || locationHeader.includes('/home');
              
              const isSuccess = (res.statusCode === 302 && isRedirectToHome) || !isLoginPage;
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

Page({
  data: {
    studentId: '',
    password: '',
    captcha: '',
    captchaImg: ''
  },

  onLoad() {
    this.refreshCaptcha();
  },

  refreshCaptcha() {
    jwxtApi.getCaptcha()
      .then(imgUrl => {
        this.setData({ captchaImg: imgUrl });
      })
      .catch(err => {
        wx.showToast({ title: '验证码加载失败', icon: 'none' });
        console.error(err);
      });
  },

  onStudentIdInput(e) {
    this.setData({ studentId: e.detail.value });
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  onCaptchaInput(e) {
    this.setData({ captcha: e.detail.value });
  },

  login() {
    const { studentId, password, captcha } = this.data;
    
    if (!studentId || !password || !captcha) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }

    const captchaUpper = captcha.toUpperCase();
    const encryptedPassword = this.md5(password);

    wx.showLoading({ title: '登录中...' });
    
    jwxtApi.login(studentId, encryptedPassword, captchaUpper)
      .then(success => {
        wx.hideLoading();
        if (success) {
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1500
          });
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/webside/webside',
              fail: () => {
                wx.showToast({ title: '跳转失败', icon: 'none' });
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
        console.error('登录错误:', err);
      });
  },

  md5(str) {
    function rotateLeft(value, shift) {
      return (value << shift) | (value >>> (32 - shift));
    }

    function add(a, b) {
      return (a + b) & 0xFFFFFFFF;
    }

    function F(x, y, z) { return (x & y) | (~x & z); }
    function G(x, y, z) { return (x & z) | (y & ~z); }
    function H(x, y, z) { return x ^ y ^ z; }
    function I(x, y, z) { return y ^ (x | ~z); }

    function FF(a, b, c, d, x, s, ac) {
      a = add(a, add(add(F(b, c, d), x), ac));
      a = add(rotateLeft(a, s), b);
      return a;
    }

    function GG(a, b, c, d, x, s, ac) {
      a = add(a, add(add(G(b, c, d), x), ac));
      a = add(rotateLeft(a, s), b);
      return a;
    }

    function HH(a, b, c, d, x, s, ac) {
      a = add(a, add(add(H(b, c, d), x), ac));
      a = add(rotateLeft(a, s), b);
      return a;
    }

    function II(a, b, c, d, x, s, ac) {
      a = add(a, add(add(I(b, c, d), x), ac));
      a = add(rotateLeft(a, s), b);
      return a;
    }

    function toHexString(byteArray) {
      return Array.from(byteArray, byte => 
        ('0' + (byte & 0xFF).toString(16)).slice(-2)
      ).join('');
    }

    function stringToUTF8Bytes(s) {
      const bytes = [];
      for (let i = 0; i < s.length; i++) {
        let c = s.charCodeAt(i);
        if (c <= 0x7F) {
          bytes.push(c);
        } else if (c <= 0x7FF) {
          bytes.push(0xC0 | (c >> 6));
          bytes.push(0x80 | (c & 0x3F));
        } else {
          bytes.push(0xE0 | (c >> 12));
          bytes.push(0x80 | ((c >> 6) & 0x3F));
          bytes.push(0x80 | (c & 0x3F));
        }
      }
      return bytes;
    }

    const message = stringToUTF8Bytes(str);
    const len = message.length;
    const wordArray = [];

    for (let i = 0; i < len; i += 4) {
      wordArray[i >> 2] = (message[i] || 0) |
        ((message[i + 1] || 0) << 8) |
        ((message[i + 2] || 0) << 16) |
        ((message[i + 3] || 0) << 24);
    }

    wordArray[len >> 2] |= 0x80 << (24 - (len % 4) * 8);
    wordArray[((len + 64) >>> 9 << 4) + 14] = len * 8;

    let a = 0x67452301;
    let b = 0xEFCDAB89;
    let c = 0x98BADCFE;
    let d = 0x10325476;

    const K = [
      0xD76AA478, 0xE8C7B756, 0x242070DB, 0xC1BDCEEE,
      0xF57C0FAF, 0x4787C62A, 0xA8304613, 0xFD469501,
      0x698098D8, 0x8B44F7AF, 0xFFFF5BB1, 0x895CD7BE,
      0x6B901122, 0xFD987193, 0xA679438E, 0x49B40821,
      0xF61E2562, 0xC040B340, 0x265E5A51, 0xE9B6C7AA,
      0xD62F105D, 0x02441453, 0xD8A1E681, 0xE7D3FBC8,
      0x21E1CDE6, 0xC33707D6, 0xF4D50D87, 0x455A14ED,
      0xA9E3E905, 0xFCEFA3F8, 0x676F02D9, 0x8D2A4C8A,
      0xFFFA3942, 0x8771F681, 0x6D9D6122, 0xFDE5380C,
      0xA4BEEA44, 0x4BDECFA9, 0xF6BB4B60, 0xBEBFBC70,
      0x289B7EC6, 0xEAA127FA, 0xD4EF3085, 0x04881D05,
      0xD9D4D039, 0xE6DB99E5, 0x1FA27CF8, 0xC4AC5665,
      0xF4292244, 0x432AFF97, 0xAB9423A7, 0xFC93A039,
      0x655B59C3, 0x8F0CCC92, 0xFFEFF47D, 0x85845DD1,
      0x6FA87E4F, 0xFE2CE6E0, 0xA3014314, 0x4E0811A1,
      0xF7537E82, 0xBD3AF235, 0x2AD7D2BB, 0xEB86D391
    ];

    for (let i = 0; i < wordArray.length; i += 16) {
      const oldA = a, oldB = b, oldC = c, oldD = d;
      const M = wordArray.slice(i, i + 16);

      a = FF(a, b, c, d, M[0], 7, K[0]);
      d = FF(d, a, b, c, M[1], 12, K[1]);
      c = FF(c, d, a, b, M[2], 17, K[2]);
      b = FF(b, c, d, a, M[3], 22, K[3]);
      a = FF(a, b, c, d, M[4], 7, K[4]);
      d = FF(d, a, b, c, M[5], 12, K[5]);
      c = FF(c, d, a, b, M[6], 17, K[6]);
      b = FF(b, c, d, a, M[7], 22, K[7]);
      a = FF(a, b, c, d, M[8], 7, K[8]);
      d = FF(d, a, b, c, M[9], 12, K[9]);
      c = FF(c, d, a, b, M[10], 17, K[10]);
      b = FF(b, c, d, a, M[11], 22, K[11]);
      a = FF(a, b, c, d, M[12], 7, K[12]);
      d = FF(d, a, b, c, M[13], 12, K[13]);
      c = FF(c, d, a, b, M[14], 17, K[14]);
      b = FF(b, c, d, a, M[15], 22, K[15]);

      a = GG(a, b, c, d, M[1], 5, K[16]);
      d = GG(d, a, b, c, M[6], 9, K[17]);
      c = GG(c, d, a, b, M[11], 14, K[18]);
      b = GG(b, c, d, a, M[0], 20, K[19]);
      a = GG(a, b, c, d, M[5], 5, K[20]);
      d = GG(d, a, b, c, M[10], 9, K[21]);
      c = GG(c, d, a, b, M[15], 14, K[22]);
      b = GG(b, c, d, a, M[4], 20, K[23]);
      a = GG(a, b, c, d, M[9], 5, K[24]);
      d = GG(d, a, b, c, M[14], 9, K[25]);
      c = GG(c, d, a, b, M[3], 14, K[26]);
      b = GG(b, c, d, a, M[8], 20, K[27]);
      a = GG(a, b, c, d, M[13], 5, K[28]);
      d = GG(d, a, b, c, M[2], 9, K[29]);
      c = GG(c, d, a, b, M[7], 14, K[30]);
      b = GG(b, c, d, a, M[12], 20, K[31]);

      a = HH(a, b, c, d, M[5], 4, K[32]);
      d = HH(d, a, b, c, M[8], 11, K[33]);
      c = HH(c, d, a, b, M[11], 16, K[34]);
      b = HH(b, c, d, a, M[14], 23, K[35]);
      a = HH(a, b, c, d, M[1], 4, K[36]);
      d = HH(d, a, b, c, M[4], 11, K[37]);
      c = HH(c, d, a, b, M[7], 16, K[38]);
      b = HH(b, c, d, a, M[10], 23, K[39]);
      a = HH(a, b, c, d, M[13], 4, K[40]);
      d = HH(d, a, b, c, M[0], 11, K[41]);
      c = HH(c, d, a, b, M[3], 16, K[42]);
      b = HH(b, c, d, a, M[6], 23, K[43]);
      a = HH(a, b, c, d, M[9], 4, K[44]);
      d = HH(d, a, b, c, M[12], 11, K[45]);
      c = HH(c, d, a, b, M[15], 16, K[46]);
      b = HH(b, c, d, a, M[2], 23, K[47]);

      a = II(a, b, c, d, M[0], 6, K[48]);
      d = II(d, a, b, c, M[7], 10, K[49]);
      c = II(c, d, a, b, M[14], 15, K[50]);
      b = II(b, c, d, a, M[5], 21, K[51]);
      a = II(a, b, c, d, M[12], 6, K[52]);
      d = II(d, a, b, c, M[3], 10, K[53]);
      c = II(c, d, a, b, M[10], 15, K[54]);
      b = II(b, c, d, a, M[1], 21, K[55]);
      a = II(a, b, c, d, M[8], 6, K[56]);
      d = II(d, a, b, c, M[15], 10, K[57]);
      c = II(c, d, a, b, M[6], 15, K[58]);
      b = II(b, c, d, a, M[13], 21, K[59]);
      a = II(a, b, c, d, M[4], 6, K[60]);
      d = II(d, a, b, c, M[11], 10, K[61]);
      c = II(c, d, a, b, M[2], 15, K[62]);
      b = II(b, c, d, a, M[9], 21, K[63]);

      a = add(a, oldA);
      b = add(b, oldB);
      c = add(c, oldC);
      d = add(d, oldD);
    }

    const result = new Uint8Array(16);
    for (let i = 0; i < 4; i++) {
      result[i * 4] = a & 0xFF;
      result[i * 4 + 1] = (a >> 8) & 0xFF;
      result[i * 4 + 2] = (a >> 16) & 0xFF;
      result[i * 4 + 3] = (a >> 24) & 0xFF;
      if (i === 0) a = b;
      else if (i === 1) a = c;
      else if (i === 2) a = d;
    }

    return toHexString(result);
  }
});
