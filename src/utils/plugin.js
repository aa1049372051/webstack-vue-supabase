const plugins = {
  install(Vue) {
    //时间控件抽取
    Vue.prototype.getdatapicker = function (time = []) {
      let result = {
        startTime: '',
        endTime: ''
      };
      if (Array.isArray(time)) {
        result.startTime = time[0] || '';
        result.endTime = time[1] || '';
      }
      return result;
    };


    //下载
    Vue.prototype.downloadFile = function (url, saveName) {
      if (typeof url === 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url); // 创建blob地址
      }
      var aLink = document.createElement('a');
      aLink.href = url;
      aLink.download = saveName; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
      var event;
      if (window.MouseEvent) event = new MouseEvent('click');
      else {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent(
          'click',
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
      }
      aLink.dispatchEvent(event);
    }



    let _ = {};
    _.now =
      Date.now ||
      function () {
        return new Date().getTime();
      };
    //常用工具
    Vue.prototype.tools = {
      routeRandomKey() {
        return new Date().getTime() + '' + Math.ceil(Math.random() * 10000);
      },
      random(m, n) {
        return Math.floor(Math.random() * (n - m)) + m
      },
      isObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
      },
      isNumber(obj) {
        return Object.prototype.toString.call(obj) === '[object Number]';
      },
      isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
      },
      isString(obj) {
        return Object.prototype.toString.call(obj) === '[object String]';
      },
      isFunction(obj) {
        return Object.prototype.toString.call(obj) === '[object Function]';
      },
      /**清空表单数据*/
      clearFormData(data) {
        if (!this.isObject(data)) {
          return;
        }
        for (let i in data) {
          if (Object.prototype.hasOwnProperty.call(data, i)) {
            if (this.isString(data[i])) {
              data[i] = '';
            } else if (this.isNumber(data[i])) {
              data[i] = 0;
            } else if (this.isArray(data[i])) {
              data[i] = [];
            }
          }
        }
      },
      checkType(obj) {
        return Object.prototype.toString.call(obj);
      },
      log() {
        let arr = Array.prototype.slice.apply(arguments);
        // let res = null;
        // if (this.isArray(obj) || this.isObject(obj)) {
        //   res = JSON.parse(JSON.stringify(obj));
        // } else {
        //   res = obj;
        // }
        // if (arr.length == 1) {
        //   console && console.log && console.log(res);
        // } else {
        //   console && console.log && console.log.apply(null, arr);
        // }
        window.log.apply(null, arr);
      },
      /**
       * 频率控制 返回函数连续调用时，func 执行频率限定为 次 / wait
       *
       * @param  {function}   func      传入函数
       * @param  {number}     wait      表示时间窗口的间隔
       * @param  {object}     options   如果想忽略开始边界上的调用，传入{leading: false}。
       *                                如果想忽略结尾边界上的调用，传入{trailing: false}
       * @return {function}             返回客户调用函数
       */
      throttle(func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) options = {};
        var later = function () {
          previous = options.leading === false ? 0 : _.now();
          timeout = null;
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        };
        return function () {
          var now = _.now();
          if (!previous && options.leading === false) previous = now;
          var remaining = wait - (now - previous);
          context = this;
          args = arguments;
          if (remaining <= 0 || remaining > wait) {
            if (timeout) {
              clearTimeout(timeout);
              timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
          } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
          }
          return result;
        };
      },
      /**
       * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
       *
       * @param  {function} func        传入函数
       * @param  {number}   wait        表示时间窗口的间隔
       * @param  {boolean}  immediate   设置为ture时，调用触发于开始边界而不是结束边界
       * @return {function}             返回客户调用函数
       */
      debounce(func, wait, immediate) {
        var timeout, args, context, timestamp, result;

        var later = function () {
          var last = _.now() - timestamp;

          if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
          } else {
            timeout = null;
            if (!immediate) {
              result = func.apply(context, args);
              if (!timeout) context = args = null;
            }
          }
        };

        return function () {
          context = this;
          args = arguments;
          timestamp = _.now();
          var callNow = immediate && !timeout;
          if (!timeout) timeout = setTimeout(later, wait);
          if (callNow) {
            result = func.apply(context, args);
            context = args = null;
          }

          return result;
        };
      },
      /**
       * 对象深拷贝
       * @param {type} p
       * @param {type} c
       */
      deepCopy(p, t) {
        let c = c || {};
        if (t) {
          c = t;
        } else if (this.isArray(p)) {
          c = [];
        } else {
          c = {};
        }
        for (let i in p) {
          if (typeof p[i] === 'object' && p[i] !== null) {
            c[i] = p[i].constructor === Array ? [] : {};
            this.deepCopy(p[i], c[i]);
          } else {
            c[i] = p[i];
          }
        }
        return c;
      },
      /**
       * 删除对象中的key
       * this.tools.deleteKey({a:1,b:2,c:3},['a','b'])=> {c:3}
       * this.tools.deleteKey([{a:1,b:2,c:3},{a:12,b:21,c:31}],['a','b'])=> [{c:3},{c:31}]
       * @param {object} obj
       * @param {array} keys
       * @returns {unresolved}
       */
      deleteKey: function (obj, keys) {
        if (!this.isArray(keys)) {
          return obj;
        }
        var datas;
        if (this.isArray(obj)) {
          var i = 0,
            len = obj.length;
          datas = [];
          for (; i < len; i++) {
            datas.push(this.deleteKey(obj[i], keys));
          }
        } else {
          datas = {};
          //复制对象,深拷贝
          var newObj = this.deepCopy(obj);
          for (var j in newObj) {
            if (keys.indexOf(j) == -1) {
              datas[j] = newObj[j];
            }
          }
        }
        return datas;
      },
      arrayToMap(data, key = 'value', value = 'label') {
        if (!this.isArray(data)) {
          return {};
        }
        let map = {};
        data.forEach(item => {
          map[item[key]] = value ? item[value] : item;
        });
        return map;
      }
    };

    /**
     * 获取二维数组指定key的位置
     * @param {string} key
     * @param {array} lists
     * @param {string} value
     * @param {boolean} isequal 是否使用全等
     * @returns {undefined}
     */
    Vue.prototype.getDataIndex = function (key, lists, value, isequal) {
      var index = -1,
        len = lists.length,
        i = 0;
      for (; i < len; i++) {
        if (isequal) {
          if (lists[i][key] === value) {
            return i;
          }
        } else {
          if (lists[i][key] == value) {
            return i;
          }
        }
      }
      return index;
    };
    /**
     * 获取数据
     * @param key
     * @param lists
     * @param value
     * @param isequal
     * @returns {{}}
     */
    Vue.prototype.getDataByKey = function (key, lists, value, isequal) {
      var index = this.getDataIndex(key, lists, value, isequal);
      return index > -1 ? lists[index] : {};
    };
    if (!Vue.prototype.log) {
      Vue.prototype.log = function () {
        let arr = Array.prototype.slice.apply(arguments);
        this.tools.log.apply(this.tools, arr);
      };
    }

    /**
     * 格式化 头部 单号
     * @param {string} value
     * @param {int} key
     * @param {int} index
     * @param {int} isdel删除前2位
     * @param {int} replaceStr用于替换字符串,默认...
     * @returns {string}
     */
    Vue.prototype.formateSN = (value, key, index, isdel = true, replaceStr = '...') => {
      if (value && value.length > 8) {
        let delnum = 0;
        if (isdel) {
          delnum = 2; //默认删除前2位
        }
        value = value.slice(delnum);
        if (!key) {
          key = 4; //默认从第4位开始替换
        }
        if (!index) {
          index = 14; //替换14个字符
        }
        let a = value.split('');
        a.splice(key, index, replaceStr);
        return a.join('');
      } else {
        return value;
      }
    };

    /**
     * 钱票通截取订单号
     */
    Vue.prototype.formateNo = value => {
      if (value && value.length > 8) {
        let a = value.split('');
        a.splice(4, 14, '...');
        return a.join('');
      } else {
        return value;
      }
    };

    //倒计时时格式化显示
    Vue.prototype.formatTimeWhenCountDown = function (diff, tmpls) {
      var tmpl = tmpls || '%{d}天%{h}时%{m}分%{s}秒',
        day,
        hour,
        minute,
        second,
        show = {
          d: /%\{d\}/.test(tmpl),
          h: /%\{h\}/.test(tmpl),
          m: /%\{m\}/.test(tmpl),
          s: /%\{s\}/.test(tmpl)
        };
      if (diff < 60) {
        tmpl = tmpl.replace(/%\{d\}.*?%/gi, '%').replace(/%\{h\}.*?%/gi, '%');
      } else if (diff < 3600) {
        tmpl = tmpl.replace(/%\{d\}.*?%/gi, '%').replace(/%\{h\}.*?%/gi, '%');
      } else if (diff < 86400) {
        tmpl = tmpl.replace(/%\{d\}.*?%/gi, '%');
      }
      day = show.d ? Math.floor(diff / 86400) : 0;
      hour = show.h ? Math.floor((diff - day * 86400) / 3600) : 0;
      minute = show.m ? Math.floor((diff - day * 86400 - hour * 3600) / 60) : 0;
      second = show.s ? diff - day * 86400 - hour * 3600 - minute * 60 : 0;
      hour = hour < 10 ? '0' + hour : hour;
      minute = minute < 10 ? '0' + minute : minute;
      second = second < 10 ? '0' + Math.round(second) : Math.round(second);
      tmpl = tmpl
        .replace(/%\{d\}/gi, day)
        .replace(/%\{h\}/gi, hour)
        .replace(/%\{m\}/gi, minute)
        .replace(/%\{s\}/gi, second);
      return tmpl;
    };
    //alert
    Vue.prototype.alert = function (
      msg,
      title = '提示',
      options = {
        type: 'warning'
      }
    ) {
      var isMobile = window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i); // 是否手机端
      if (isMobile) {
        this.$message({
          message: msg,
          type: options.type
        });
        return;
      }
      this.$alert(msg, title, options);
    };
    /**
     * 时间
     */
    let jpTimes = {
      timeDiff: 0, //客户端和服务端时间戳 服务端-客户端,
      setTimeDiffByServiceTime(serviceTime) {
        this.timeDiff = parseInt(serviceTime) - Date.parse(new Date()) / 1000;
      },
      /**
       * 获取指定时间的时间戳,单位秒,无参返回当前时间戳
       * @param {string} stringTime  指定时间
       * @returns {Number}
       */
      getTimeStamp: function (stringTime) {
        stringTime = stringTime ? (stringTime += '') : '';
        return Date.parse(stringTime !== '' ? new Date(stringTime) : new Date()) / 1000 + this.timeDiff;
      },
      /**
       * 获取指定时间的时间戳,单位豪秒,无参返回当前时间戳
       * @param {string} stringTime  指定时间
       * @returns {Number}
       */
      getTimeStampMS: function (stringTime) {
        stringTime = stringTime ? (stringTime += '') : '';
        return (stringTime !== '' ? new Date(stringTime) : new Date()).getTime() + this.timeDiff * 1000;
      },
      /**
       * 获取指定时间的时间戳
       * @param {string} stringTime  指定时间
       * @returns {time_L1.time.getTimeStampArr.timeAnonym$0}
       */
      getTimeStampArr: function (stringTime) {
        return {
          time: this.getTimeStamp(stringTime),
          timems: this.getTimeStampMS(stringTime)
        };
      },
      _pretty: function (v) {
        return v < 10 ? '0' + v : v;
      },
      /**
       * 时间戳格式化,时间戳以秒为单位
       * y:年 m:日 d:月 h:时 i:分 s:秒 time:时间
       * @param {int} timeStamp
       * @returns {undefined}
       */
      timeFormat: function (timeStamp) {
        timeStamp || (timeStamp = this.getTimeStamp());
        var target = new Date(timeStamp * 1000),
          year = target.getFullYear(),
          month = target.getMonth() + 1,
          date = target.getDate(),
          hour = target.getHours(),
          minute = target.getMinutes(),
          second = target.getSeconds();
        month = this._pretty(month);
        date = this._pretty(date);
        hour = this._pretty(hour);
        minute = this._pretty(minute);
        second = this._pretty(second);
        var data = {
          y: year,
          m: month,
          d: date,
          h: hour,
          i: minute,
          s: second
        };
        data.time = year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
        data.day = year + '' + month + '' + date;
        return data;
      }
    };
    !(function () {
      /**
       * 获取本周、本季度、本月、上月的开始日期、结束日期
       */
      var now = new Date(); //当前日期
      var nowDayOfWeek = now.getDay(); //今天本周的第几天
      var nowDay = now.getDate(); //当前日
      var nowMonth = now.getMonth(); //当前月
      var nowYear = now.getYear(); //当前年
      nowYear += nowYear < 2000 ? 1900 : 0; //
      var lastMonthDate = new Date(); //上月日期
      lastMonthDate.setDate(1);
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
      // var lastYear = lastMonthDate.getYear();
      var lastMonth = lastMonthDate.getMonth();
      var firstDayOfWeek = 1; //默认是0,星期天为一周的第一天,修改成星期一为一周的第一天
      //格式化日期：yyyy-MM-dd
      function formatDate(date) {
        var myyear = date.getFullYear();
        var mymonth = date.getMonth() + 1;
        var myweekday = date.getDate();
        if (mymonth < 10) {
          mymonth = '0' + mymonth;
        }
        if (myweekday < 10) {
          myweekday = '0' + myweekday;
        }
        return myyear + '-' + mymonth + '-' + myweekday;
      }

      //获得某月的天数
      function getMonthDays(myMonth) {
        var monthStartDate = new Date(nowYear, myMonth, 1);
        var monthEndDate = new Date(nowYear, myMonth + 1, 1);
        var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
        return days;
      }

      //获得本季度的开始月份
      function getQuarterStartMonth() {
        var quarterStartMonth = 0;
        if (nowMonth < 3) {
          quarterStartMonth = 0;
        }
        if (2 < nowMonth && nowMonth < 6) {
          quarterStartMonth = 3;
        }
        if (5 < nowMonth && nowMonth < 9) {
          quarterStartMonth = 6;
        }
        if (nowMonth > 8) {
          quarterStartMonth = 9;
        }
        return quarterStartMonth;
      }

      //获得本周的开始日期
      function getWeekStartDate() {
        var weekStartDate = '';
        if (firstDayOfWeek == 0) {
          weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
        } else {
          if (nowDayOfWeek == 0) {
            weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1 - 7);
          } else {
            weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1);
          }
        }
        return formatDate(weekStartDate);
      }

      //获得本周的结束日期
      function getWeekEndDate() {
        var weekEndDate = '';
        if (firstDayOfWeek == 0) {
          weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
        } else {
          if (nowDayOfWeek == 0) {
            weekEndDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
          } else {
            weekEndDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 7);
          }
        }
        return formatDate(weekEndDate);
      }

      //获得上周的开始日期
      function getLastWeekStartDate() {
        var weekStartDate = '';
        if (firstDayOfWeek == 0) {
          weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 7);
        } else {
          if (nowDayOfWeek == 0) {
            weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1 - 14);
          } else {
            weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1 - 7);
          }
        }
        return formatDate(weekStartDate);
      }

      //获得上周的结束日期
      function getLastWeekEndDate() {
        var weekEndDate = '';
        if (firstDayOfWeek == 0) {
          weekEndDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 1);
        } else {
          if (nowDayOfWeek == 0) {
            weekEndDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 7);
          } else {
            weekEndDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
          }
        }
        return formatDate(weekEndDate);
      }

      //获得本月的开始日期
      function getMonthStartDate() {
        var monthStartDate = new Date(nowYear, nowMonth, 1);
        return formatDate(monthStartDate);
      }

      //获得本月的结束日期
      function getMonthEndDate() {
        var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
        return formatDate(monthEndDate);
      }

      //获得上月开始时间
      function getLastMonthStartDate() {
        var lastMonthStartDate;
        if (nowMonth == 0) {
          //月份为上年的最后月份
          lastMonthStartDate = new Date(nowYear - 1, 11, 1);
          return formatDate(lastMonthStartDate);
        }
        lastMonthStartDate = new Date(nowYear, lastMonth, 1);
        return formatDate(lastMonthStartDate);
      }

      //获得上月结束时间
      function getLastMonthEndDate() {
        var lastMonthEndDate;
        if (nowMonth == 0) {
          //月份为上年的最后月份
          lastMonthEndDate = new Date(nowYear - 1, 11, 31);
          return formatDate(lastMonthEndDate);
        }
        lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
        return formatDate(lastMonthEndDate);
      }

      //获得本季度的开始日期
      function getQuarterStartDate() {
        var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1);
        return formatDate(quarterStartDate);
      }

      //获得本季度的结束日期
      function getQuarterEndDate() {
        var quarterEndMonth = getQuarterStartMonth() + 2;
        var quarterStartDate = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth));
        return formatDate(quarterStartDate);
      }

      function getBeforeDate(m) {
        var n = m;
        var d = new Date();
        var year = d.getFullYear();
        var mon = d.getMonth() + 1;
        var day = d.getDate();
        if (day <= n) {
          if (mon > 1) {
            mon = mon - 1;
          } else {
            year = year - 1;
            mon = 12;
          }
        }
        d.setDate(d.getDate() - n);
        year = d.getFullYear();
        mon = d.getMonth() + 1;
        day = d.getDate();
        let s = year + '-' + (mon < 10 ? '0' + mon : mon) + '-' + (day < 10 ? '0' + day : day);
        return s;
      }

      var times = {
        getQuarterEndDate: getQuarterEndDate,
        getQuarterStartDate: getQuarterStartDate,
        getLastMonthEndDate: getLastMonthEndDate,
        getLastMonthStartDate: getLastMonthStartDate,
        getMonthEndDate: getMonthEndDate,
        getMonthStartDate: getMonthStartDate,
        getLastWeekEndDate: getLastWeekEndDate,
        getLastWeekStartDate: getLastWeekStartDate,
        getWeekEndDate: getWeekEndDate,
        getWeekStartDate: getWeekStartDate,
        getQuarterStartMonth: getQuarterStartMonth,
        getMonthDays: getMonthDays,
        formatDate: formatDate,
        getTodayDate: getBeforeDate.bind(null, 0),
        getYesterdayDate: getBeforeDate.bind(null, 1)
      };
      if (jpTimes) {
        jpTimes = Object.assign(jpTimes, times);
      }
    })(window);
    Vue.prototype.jpTimes = jpTimes;


    Vue.prototype.json = data => {
      return JSON.parse(JSON.stringify(data));
    };
    var runNext = arr => {
      if (arr.length == 0) {
        return;
      }
      arr[0](() => {
        runNext(arr.slice(1));
      });
    };
    Vue.prototype.runNext = runNext;
    // Vue.prototype.$cache = cache;
    let tools = Vue.prototype.tools;
    class countDown {
      constructor(seconds, callback, complete, rate) {
        this.seconds = tools.isNumber(seconds) && seconds > 0 ? seconds : 5;
        this.callback = tools.isFunction(callback) ? callback : function () { };
        this.complete = tools.isFunction(complete) ? complete : function () { };
        this.rate = tools.isNumber(rate) && rate > 0 ? rate : 1;
        this.init();
      }
      init() {
        var self = this;
        self.callback(self.seconds);

        function fn() {
          self.seconds--;
          self.callback(self.seconds);
          if (self.seconds == 0) {
            self.stop();
            self.complete();
          } else {
            //self.callback(self.seconds);
          }
        }

        this.interval = setInterval(fn, 1000 * this.rate);
      }

      stop() {
        clearInterval(this.interval);
      }
    }

    Vue.prototype.$countDown = countDown;

    //重写trim
    String.prototype.trim = function (char, type) {
      if (char) {
        if (type == 'left') {
          return this.replace(new RegExp('^\\' + char + '+', 'g'), '');
        } else if (type == 'right') {
          return this.replace(new RegExp('\\' + char + '+$', 'g'), '');
        }
        return this.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');
      }
      return this.replace(/^\s+|\s+$/g, '');
    };

    Vue.prototype.generateUUID = function () {
      var d = new Date().getTime();
      var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      return uuid;
    }
  }
};

export default plugins;