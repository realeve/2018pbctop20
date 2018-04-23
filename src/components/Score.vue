<template>
  <div>
    <x-header></x-header>
    <div class="score-content">
      <p class="info"> 票数汇总 </p>
      <p class="desc" v-if="isAdmin">信息填写: {{countInfo.address}} / {{countInfo.alls}}</p>
      <p class="desc" v-if="isAdmin">投票情况: {{luckers}} 人选对{{sport.maxTickets}}项</p>
      <p class="desc"> 你所投的{{voteNum.length}}位{{sport.name}}截止目前总票数如下 </p>
      <group>
        <cell v-for="(user,i) in voteNum" :title="(i+1)+'.'+user.vote_name" :value="user.vote_nums+' 票'" :key="i"></cell>
      </group>
    </div>
    <p class="info"> 各地区票数汇总 </p>
    <group style="margin-bottom:20px;">
      <cell v-for="(item,i) in provInfo" :title="item.prov" :value="item.num+' 票'" :key="i"></cell>
    </group>
    <div style="margin:0 20px 20px 20px;">
      <x-button @click.native="init" type="primary">刷新数据</x-button>
    </div>
    <x-footer/>
  </div>
</template>

<script>
import XHeader from "./Header";
import { Cell, Group, Toast, XButton } from "vux";
import util from "../js/common";

import { mapState } from "vuex";
import XFooter from "./Footer";
export default {
  components: {
    XHeader,
    XButton,
    Cell,
    Group,
    Toast,
    XFooter
  },
  data() {
    return {
      voteNum: [],
      countInfo: {
        alls: "",
        address: ""
      },
      luckers: "",
      provInfo: ""
    };
  },
  computed: {
    ...mapState(["cdnUrl", "sport", "userInfo"]),
    openid() {
      return this.userInfo.openid;
    },
    isAdmin() {
      return (
        [
          "oW0w1v4qftC8xUP3q-MPIHtXB7hI",
          "oW0w1v28ykr6042MA2XnccUlMsVg",
          "oW0w1vxG2WkLPHu6d1tgZVQ_SyC8"
        ]
          .join(" ")
          .indexOf(this.openid) > -1
      );
    }
  },
  methods: {
    showToast(settings) {
      this.toast.text = settings.text;
      this.toast.type = settings.type;
      this.toast.show = true;
      setTimeout(() => {
        this.toast.show = false;
      }, 1500);
    },
    getVoteNums() {
      let url = this.cdnUrl;

      let params = {
        sid: this.sport.id,
        openid: this.openid
      };
      if (this.isAdmin) {
        params = {};
      }
      params.s = "/addon/Api/Api/getVoteCount";

      this.$http
        .jsonp(url, {
          params
        })
        .then(res => {
          if (!res.ok) {
            this.showToast({
              text: "票数获取失败",
              type: "warn"
            });
            return;
          }
          this.voteNum = res.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    getCountInfo() {
      let url = this.cdnUrl + "?s=/addon/Api/Api/countVoteInfo";

      this.$http
        .jsonp(url, {
          params: {
            sid: this.$store.state.sport.id
          }
        })
        .then(res => {
          this.countInfo = res.data[0];
        })
        .catch(e => {
          console.log(e);
        });
    },
    getPrizeInfo() {
      let url = this.cdnUrl + "?s=/addon/Api/Api/countPrizeInfo";

      this.$http
        .jsonp(url, {
          params: {
            sid: this.$store.state.sport.id,
            max: this.$store.state.sport.maxTickets
          }
        })
        .then(res => {
          this.luckers = res.data[0].luckers;
        })
        .catch(e => {
          console.log(e);
        });
    },
    getVoteByProv() {
      let url = this.cdnUrl + "?s=/addon/Api/Api/countVoteByProv";

      this.$http
        .jsonp(url)
        .then(res => {
          this.provInfo = res.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    init() {
      this.getVoteNums();
      if (this.isAdmin) {
        this.getCountInfo();
        this.getPrizeInfo();
        this.getVoteByProv();
      }
    }
  },
  created() {
    // if (this.openid == null) {
    //   this.$router.push("/follow");
    //   return;
    // }
    this.init();
  }
};
</script>

<style lang="less" scoped>
.score-content {
  padding: 15px;
  padding-top: 10px;
  .info {
    font-size: 20px;
    font-weight: bold;
    padding-bottom: 5px;
    padding-left: 10px;
  }
  .desc {
    padding-top: 5px;
    color: #636563;
    font-size: 16px;
    text-align: left;
  }
  .vux-label {
    text-align: left;
  }
}
.info {
  font-size: 20px;
  font-weight: bold;
  padding-bottom: 5px;
  padding-top: 20px;
}
</style>
