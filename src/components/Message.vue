<template>
  <div>
    <x-header></x-header>
    <div class="content">
      <msg title="活动结束" description="活动已结束，感谢你的关注！" icon="success"></msg>
    </div>
  </div>
</template>

<script>
import XHeader from "./Header";
import util from "../js/common";
import { Msg } from "vux";

export default {
  components: {
    XHeader,
    Msg
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
  }
}
</style>
