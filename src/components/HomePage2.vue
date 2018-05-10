<template>
  <div class="wrapper">
    <div class="content">
      <Pbc/>
      <div class="btn-wrapper">
        <div class="weui-btn weui-btn_default" @click="jump('home')">开始投票</div>
      </div>
    </div>
    <div class="canvas" id="home"></div>
    <x-footer color="#000" showBg="false" />
  </div>
</template>
<script>
import particles from "particles.js";
import particlesSetting from "../js/particlesSetting";

import XFooter from "./Footer";
import { XButton, Toast } from "vux";
import { mapState } from "vuex";
import Pbc from "./Pbclogo";
export default {
  components: {
    XButton,
    XFooter,
    Pbc
  },
  computed: {
    ...mapState(["cdnUrl"]),
    sport: {
      get() {
        return this.$store.state.sport;
      },
      set(val) {
        this.$store.commit("setSport", val);
      }
    },
    sportDate() {
      let { startDate, endDate } = this.sport;
      let startInfo = startDate.split("-");
      let endInfo = endDate.split("-");
      startInfo[1] = parseInt(startInfo[1], 10);
      startInfo[2] = parseInt(startInfo[2], 10);
      endInfo[1] = parseInt(endInfo[1], 10);
      endInfo[2] = parseInt(endInfo[2], 10);

      // 不同年
      if (startInfo[0] !== endInfo[0]) {
        return `${startInfo[0]}年${startInfo[1]}月${startInfo[2]}日 至 ${
          endInfo[0]
        }年${endInfo[1]}月${endInfo[2]}日`;
      }

      // 同年同月
      if (startInfo[0] === endInfo[1]) {
        return `${startInfo[0]}年${startInfo[1]}月${startInfo[2]}日 至 ${
          endInfo[2]
        }日`;
      } else {
        return `${startInfo[0]}年${startInfo[1]}月${startInfo[2]}日 至 ${
          endInfo[1]
        }月${endInfo[2]}日`;
      }
    }
  },
  methods: {
    jump(router) {
      var video = document.querySelector("#mainvideo");
      // video.play();
      // video.pause();
      this.$router.push(router);
    }
  },
  mounted() {
    particlesJS("home", particlesSetting);
    document.title = this.sport.name;
  }
};
</script>
<style lang="less" scoped>
.wrapper {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  // background-color: #e33e3e;
  background: url("../assets/main.jpg") no-repeat;
  background-size: cover;
  background-position: 50% 100%;
  background-origin: content-box;
}

.content {
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: column;
  font-size: 13pt;
  color: #333;
  width: 100%;
  justify-content: center;
  margin-bottom: 20px;
  .btn-wrapper {
    position: absolute;
    bottom: 33%;
    width: 40%;
    font-size: 10pt;
    opacity: 0.9;
    p {
      padding-bottom: 10px;
    }
  }
}

.canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.weui-btn_default {
  background: #e92a27;
  color: #fafafa;
  &:hover {
    color: #fafafa;
    background-color: #f36853;
  }
}

.weui-btn:after {
  border-color: rgba(255, 255, 255, 0.5);
}

.slogan {
  padding-top: 15px;
  font-size: 15pt;
  color: #f3d713;
}
</style>
