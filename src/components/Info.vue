<template>
  <div>
    <x-header></x-header>
    <template v-if="!hasUserInfo">
      <div class="content">
        <p class="info">个人信息</p>
        <p class="desc">本页面并非必填信息，仅用于活动结束抽奖时邮寄奖品，同时我们承诺不会将该信息用于其它用途，如不完整填写详细联系方式视为自动放弃抽奖资格。</p>
      </div>
      <group label-width="4.5em" label-margin-right="2em" label-align="right">
        <x-input title="姓名" v-model="user" placeholder="请填写收件人姓名" :required="true" :show-clear="true"></x-input>
        <x-input title="手机号" is-type="china-mobile" v-model="mobile" :show-clear="true" :required="true" placeholder="请输入手机号"></x-input>
        <x-address title="地址选择" v-model="address" raw-value :list="addressData" :required="true" value-text-align="left"></x-address>
        <x-textarea title="详细地址" placeholder="请填写详细地址" v-model="detail" :required="true" :show-counter="false" :show-clear="true" :rows="3"></x-textarea>
      </group>
    </template>
    <msg v-else :title="msg.title" :description="msg.desc" :icon="msg.icon"></msg>
    <toast v-model="toast.show" :type="toast.type">{{toast.text}}</toast>

    <div class="submit">
      <x-button v-show="!hasUserInfo" @click.native="submit" type="primary">提交数据</x-button>
      <x-button v-show="showError" type="warn" @click.native="reback">我要反馈</x-button>
      <x-button @click.native="jump" type="default">查看票数</x-button>
    </div>

    <x-footer/>
  </div>
</template>

<script>
import {
  Msg,
  Divider,
  Toast,
  XTextarea,
  XAddress,
  // ChinaAddressV4Data,
  XButton,
  Group,
  Cell,
  XInput,
  PopupPicker,
  Picker,
  Value2nameFilter as value2name
} from "vux";

import ChinaAddressV4Data from "./vux_china_address_v4.json";

import XHeader from "./Header2";
import util from "../js/common";
import XFooter from "./Footer";

export default {
  components: {
    Cell,
    Toast,
    XButton,
    Group,
    XAddress,
    XTextarea,
    XInput,
    PopupPicker,
    Picker,
    XHeader,
    XFooter,
    Msg,
    Divider
  },
  data() {
    return {
      addressData: ChinaAddressV4Data,
      toast: {
        show: false,
        text: "",
        type: ""
      },
      user: "",
      mobile: "",
      detail: "",
      address: ["北京市", "市辖区", "东城区"],
      showScore: false,
      hasUserInfo: false,
      showError: false,
      msg: {
        title: "个人信息提交成功",
        desc: "感谢你的参与",
        icon: "success"
      }
    };
  },
  computed: {
    openid() {
      return this.$store.state.userInfo.openid;
    }
  },
  methods: {
    getName(value) {
      return value2name(value, ChinaAddressV4Data);
    },
    showToast(settings) {
      this.toast.text = settings.text;
      this.toast.type = settings.type;
      this.toast.show = true;
      setTimeout(() => {
        this.toast.show = false;
      }, 1500);
    },
    reback() {
      window.location.href = "http://mp.weixin.qq.com/s/vFPSwUi1RxD1FJJqTzK93w";
    },
    submit() {
      let address = this.getName(this.address).split(" ");
      let params = {
        user: this.user,
        mobile: this.mobile,
        prov: address[0],
        city: address[1],
        area: address[2],
        detail: this.detail,
        openid: this.openid,
        rec_time: util.getNow()
      };

      // if (JSON.stringify(params).indexOf('""') > 0) {
      //   this.showToast({
      //     text: "请填写个人信息",
      //     type: "warn"
      //   });
      //   return;
      // }

      let url = this.$store.state.cdnUrl + "?s=/addon/Api/Api/setUserInfo";
      this.$http
        .jsonp(url, {
          params
        })
        .then(res => {
          if (!res.ok) {
            this.showToast({
              text: "数据失败",
              type: "warn"
            });
            return;
          }
          var data = res.data;

          this.showToast({
            text: "提交成功",
            type: "success"
          });
          this.msg.title = "个人信息提交成功";
          this.msg.desc = "感谢你的参与";
          this.msg.icon = "success";

          this.hasUserInfo = true;
        })
        .catch(e => {
          this.hasUserInfo = true;
          this.msg.title = "糟糕了，信息提交失败";
          this.msg.icon = "warn";
          Reflect.deleteProperty(params, "callback");

          params.status = e.status;
          params.statusText = e.statusText;
          this.showError = true;
          this.msg.desc =
            '请复制以下信息并<a href="http://mp.weixin.qq.com/s/vFPSwUi1RxD1FJJqTzK93w">点击此处提交至后台小编</a>：<br><br>' +
            JSON.stringify(params);
        });
    },
    getStep() {
      let url = this.$store.state.cdnUrl;
      let params = {
        s: "/addon/Api/Api/isSetUserInfo",
        openid: this.openid,
        sid: this.$store.state.sport.id
      };
      this.$http
        .jsonp(url, {
          params
        })
        .then(res => {
          var data = res.data;
          this.showScore = data.status == 2;
          if (data.status == 0) {
            this.$router.push("/home");
            return;
          }
          this.user = data.user;
          this.mobile = data.mobile;
          this.detail = data.detail;
          this.address = [data.prov, data.city, data.area];
        })
        .catch(e => {
          console.log(e);
        });
    },
    jump() {
      this.$router.push("/score");
    }
  },
  created() {
    this.getStep();
  }
};
</script>

<style scoped lang="less">
.content {
  padding: 15px;
  padding-top: 10px;
  .info {
    display: flex;
    justify-content: center;
    font-size: 20px;
    width: 100%;
    border-bottom: 1px solid #ddd;
    padding-bottom: 5px;
  }
  .desc {
    padding-top: 5px;
    color: #636563;
    font-size: 14px;
    text-indent: 2em;
  }
}

.vote {
  margin-bottom: 25px;
  .vux-divider {
    font-size: 24px;
    color: #333;
  }
}

.submit {
  margin: 10px 15px 25px 15px;
}
</style>
