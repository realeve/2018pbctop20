<template>
  <div id="app">
    <!-- <v-header/> -->
    <loading v-model="isLoading" />
    <router-view/>
    <!-- <v-foot/>  -->
    <!-- <video id="mainvideo" x5-video-orientation="portrait" preload=auto x5-video-player-type="h5" x5-video-player-fullscreen="true" x-webkit-airplay="true" playsinline webkit-playsinline="true" src="http://www.cbpc.ltd/public/topic/2017invite/assets/video/portrait.mp4"></video> -->
  </div>
</template>

<script>
import { Loading } from "vux";

import { querystring } from "vux";

import { mapState } from "vuex";
export default {
  name: "app",
  components: {
    Loading
  },
  data() {
    return {
      code: "",
      apiId: "wx762c9153df774440",
      title: "",
      shouldShare: false
    };
  },
  computed: {
    ...mapState(["cdnUrl", "sport"]),
    isLoading: {
      get() {
        return this.$store.state.isLoading;
      },
      set(val) {
        this.$store.commit("updateLoadingStatus", val);
      }
    },
    userInfo: {
      get() {
        return this.$store.state.userInfo;
      },
      set(val) {
        this.$store.commit("setUserinfo", val);
      }
    },
    // 签名用URL
    url() {
      return window.location.href.split("#")[0];
    },
    // 跳转URL
    redirectUrl() {
      return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
        this.apiId
      }&redirect_uri=${encodeURIComponent(
        this.url
      )}&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect`;
    },
    shareUrl() {
      // 被分享的链接必须在安全域名中，不能直接分享为 redirectUrl
      return window.location.href.split("#")[0].split("?")[0];
    },
    shouldInitShare() {
      return this.sport.isLogin && this.shouldShare;
    }
  },
  watch: {
    shouldInitShare(val) {
      if (!val) {
        return;
      }
      this.title = `我刚刚参加了${this.sport.name}投票活动，你也来参与吧`;
      this.initWxShare();
    }
  },
  methods: {
    wxPermissionInit() {
      let params = {
        s: "/addon/Api/Api/getSignature",
        url: this.url
      };
      return this.$http
        .jsonp(this.cdnUrl, {
          params
        })
        .then(res => res.data);
    },
    wxReady(obj) {
      let config = {
        debug: false,
        appId: obj.appId,
        timestamp: obj.timestamp,
        nonceStr: obj.nonceStr,
        signature: obj.signature,
        jsApiList: [
          "onMenuShareAppMessage",
          "onMenuShareTimeline",
          "hideMenuItems"
        ]
      };
      this.$wechat.config(config);
    },
    initWxShare() {
      this.$wechat.ready(() => {
        let option = {
          title: this.title, // 分享标题
          desc: this.title,
          link: this.shareUrl,
          imgUrl: "http://cbpm.sinaapp.com/cdn/logo/cbpm.jpg",
          type: "",
          dataUrl: "",
          success: function() {},
          cancel: function() {}
        };
        this.$wechat.onMenuShareAppMessage(option);
        this.$wechat.onMenuShareTimeline(option);
        this.$wechat.onMenuShareQQ(option);
        this.$wechat.onMenuShareWeibo(option);
        this.$wechat.onMenuShareQZone(option);

        // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        this.$wechat.hideMenuItems({
          menuList: [
            "menuItem:editTag",
            "menuItem:delete",
            "menuItem:copyUrl",
            "menuItem:originPage",
            "menuItem:readMode",
            "menuItem:openWithQQBrowser",
            "menuItem:openWithSafari",
            "menuItem:share:email"
          ]
        });
      });
    },
    // 获取微信用户信息（昵称，地区）
    getWXUserInfo() {
      // let userInfo;
      // let wx_userinfo = localStorage["wx_userinfo"];
      // if (typeof wx_userinfo != "undefined") {
      //   userInfo = JSON.parse(wx_userinfo);
      //   this.userInfo = userInfo;
      //   return;
      // }
      // this.getWXInfo();
      let userInfo;
      let wx_userinfo = localStorage.getItem("wx_userinfo");
      if (null == wx_userinfo || typeof wx_userinfo == "undefined") {
        this.getWXInfo();
        return;
      }
      userInfo = JSON.parse(wx_userinfo);
      this.userInfo = userInfo;
    },
    getWXInfo() {
      let params = {
        s: "/addon/Api/Api/getUserInfo",
        code: this.code
      };
      this.$http
        .jsonp(this.cdnUrl, {
          params
        })
        .then(res => {
          this.userInfo = res.data;
          if (Reflect.get(res.data, "nickname")) {
            localStorage.setItem("wx_userinfo", JSON.stringify(res.data));
          }
        });
    },
    wxInit() {
      if (this.sport.loadWXInfo && !this.needRedirect()) {
        this.getWXUserInfo();
      }
      this.wxPermissionInit().then(res => {
        this.shouldShare = true;
        this.wxReady(res);
        this.initWxShare();
        this.recordReadNum();
      });
    },
    needRedirect() {
      let hrefArr = window.location.href.split("?");
      if (hrefArr.length == 1) {
        window.location.href = this.redirectUrl;
        return true;
      }
      let params = querystring.parse(hrefArr[1]);
      this.code = params.code;
      return false;
    },
    recordReadNum() {
      if (location.href.indexOf("localhost") > -1) {
        return;
      }
      let url = window.location.href.split("?")[0];
      let params = {
        s: "/addon/Api/Api/recordReadNum",
        url
      };
      this.$http.jsonp(this.cdnUrl, {
        params
      });
    }
  },
  created() {
    this.title = this.sport.name + "活动";
    // 开发模式下，初始化值
    if (process.env.NODE_ENV == "development") {
      this.userInfo = {
        openid: "oW0w1v4qftC8xUP3q-MPIHtXB7hI",
        nickname: "宾不厌诈",
        sex: 1,
        language: "zh_CN",
        city: "成都",
        province: "四川",
        country: "中国",
        headimgurl:
          "http://wx.qlogo.cn/mmhead/Q3auHgzwzM7RSAYiaxiaC1lOZYicWic9YZKEFJ2TKEfh3pFJibLvf7IxdLQ/0",
        privilege: []
      };
    } else {
      // 正式环境微信载入
      this.wxInit();
    }
  }
};
</script>

<style lang="less">
@import "~vux/src/styles/reset.less";
@import "assets/css/reset.css";
@import "assets/css/slider.less";

// #mainvideo {
//   position: absolute;
//   left: 0;
//   top: 0;
//   width: 100%;
//   min-height: 100vh;
// }

// .router-view {
//   position: absolute !important;
//   width: 100%;
//   min-height: 100vh;
//   z-index: 1;
// }

.weui-media-box__bd {
  text-align: left;
}
</style>
