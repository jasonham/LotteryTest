<template>
  <div class="content">
    <el-dialog
      v-model="dialogVisible"
      title="抽奖结果"
      width="500"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <span v-html="msg"></span>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="
              () => {
                dialogVisible = false;
                disabledLottery = false;
              }
            "
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
    <div class="wheel">
      <div
        class="round"
        :class="{ not_roting: !roting }"
        :style="{
          transition: `${config.round_time}ms`,
          transform: `rotate(${deg}deg)`,
        }"
      >
        <img src="@/assets/image/luck_draw/wheel.png" alt="转盘图片" />
        <!--奖品，宽高保持一致，以转盘中心为原点，旋转 360/奖品个数 的角度-->
        <div class="prize">
          <div
            class="item_box"
            v-for="(item, index) in config.prizeList"
            :style="{
              color: config.text_color,
              transform: `rotate(${
                (360 / config.prizeList.length) * index
              }deg)`,
            }"
            :key="index.toString()"
          >
            <div class="item">
              <span class="text">{{ item.text }}</span>
              <img class="img" :src="item.img" :alt="item.text" />
            </div>
          </div>
        </div>
      </div>
      <div class="icon">
        <img src="@/assets/image/luck_draw/icon.png" alt="中央LOGO" />
      </div>
      <div class="arrow">
        <img src="@/assets/image/luck_draw/arrow.png" alt="顶部箭头" />
      </div>
    </div>
    <div class="btn">
      <el-button
        type="success"
        round
        :disabled="disabledLottery"
        @click="clickBtn"
        >立即抽奖{{ chance }}/3</el-button
      >
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted } from "vue";

import prize0 from "@/assets/image/luck_draw/prize0.png";
import prize1 from "@/assets/image/luck_draw/prize1.jpg";
import prize2 from "@/assets/image/luck_draw/prize2.jpg";
import prize3 from "@/assets/image/luck_draw/prize3.jpg";
import prize4 from "@/assets/image/luck_draw/prize4.jpg";
import prize5 from "@/assets/image/luck_draw/prize5.jpg";
import prize6 from "@/assets/image/luck_draw/prize6.jpg";
import prize7 from "@/assets/image/luck_draw/prize7.png";

let disabledLottery = ref(false);
let dialogVisible = ref(false);
let msg = ref("很遗憾，祝您下次好运！");
let chance = ref(3);
onMounted(() => {
  console.log("Component is mounted!");
});

const roting = ref(false);
const loading = ref(false);
const deg = ref(0);
const config = reactive({
  round_time: 5000, // 获取到奖品后转盘旋转动画时间
  text_color: "#000", // 文字颜色
  // 奖品列表
  prizeList: [
    { id: 1, text: "乐园年卡兑换码", img: prize0 },
    { id: 2, text: "雪莉玫绒毛玩具", img: prize1 },
    { id: 3, text: "达菲绒毛玩具", img: prize2 },
    { id: 4, text: "杰拉多尼绒毛玩具", img: prize3 },
    { id: 5, text: "可琦安绒毛玩具", img: prize4 },
    { id: 6, text: "星黛露绒毛玩具", img: prize5 },
    { id: 7, text: "玲娜贝尔绒毛玩具", img: prize6 },
    { id: 8, text: "谢谢参与", img: prize7 },
  ],
});
/**
 * 根据奖品获取转盘角度
 * @param {number} index 获得奖品在 prizeList 中的 index
 * @param {number} count 奖品数量
 * @return {number}
 */
const getRote = (index, count) => {
  if (!count) count = 8; // 若不传奖品数量，则默认为8
  const MAX_ROUND = 10; // 最大转圈数
  const MIN_ROUND = 8; // 最小转圈数
  const OFFSET_MULTIPLE = 0.6; // 偏移量倍数，范围 [0, 1)，例如4个奖品时，偏移量是[-45, 45)，若倍数为 1，则可能出现贴边的情况
  const unit = 360 / count; // 单元角度，为360 ÷ 奖品总数
  const offset = Math.floor(Math.random() * -unit) + unit / 2;
  const newDeg =
    360 * Math.floor(Math.random() * (MAX_ROUND - MIN_ROUND + 1) + MIN_ROUND) -
    unit * index;
  return newDeg + OFFSET_MULTIPLE * offset;
};
const clickBtn = () => {
  disabledLottery.value = true;
  if (chance.value <= 0) {
    msg.value = `抽奖次数已用完<br/>
    获得奖品
    <b><span style="color: red;">
    ${config.prizeList[0].text}!
    </span></b>
            <br/>兑换码稍后以短信形式发到您的预留手机号上,<br/>请注意查收！`;
    dialogVisible.value = true;
    return true;
  }
  chance.value -= 1;
  if (roting.value || loading.value) return;
  loading.value = true;
  // 前端生成随机数奖品
  // const activePrize = config.prizeList[Math.floor(Math.random() * 7)];
  let activePrize = config.prizeList[7];
  if (chance.value == 0) {
    activePrize = config.prizeList[0];
    msg.value = `恭喜获得奖品
    <b><span style="color: red;">
    ${activePrize.text}!
    </span></b>
            <br/>兑换码稍后以短信形式发到您的预留手机号上,<br/>请注意查收！`;
  }

  // 使用 some 循环，获取到奖品即停止遍历
  config.prizeList.some((item, index) => {
    if (item.id === activePrize.id) {
      // 获取该奖品的一个随机角度，具体见下方函数注释
      const newDeg = getRote(index, config.prizeList.length);
      // roting 为 true 时，转盘有旋转动画，时间为 config.round_time
      roting.value = true;
      deg.value = newDeg;
      setTimeout(() => {
        // 经过 config.round_time 的时间后，转盘进行复位，方便下一次抽取，deg 不取 0 而是 NewDeg % 360 以确保用户看不到转盘闪动
        roting.value = false;
        deg.value = newDeg % 360;
        // alert(
        //   `恭喜获得奖品 ${activePrize.text}!
        //   兑换码稍后以短信形式发到您的预留手机号上`
        // );
        dialogVisible.value = true;
      }, config.round_time);
      return true;
    }
  });
  loading.value = false;
};

const handleClose = (done) => {
  disabledLottery.value = false;
  done();
};
</script>
<style scoped>
/* 移动端，限制最大宽度 750 */
.content {
  width: 100%;
  max-width: 750px;
  margin: auto;
  overflow-x: hidden;
  /* margin、padding的百分比基于宽度，在使用rem的情况下，高度和宽度保持比例可以用padding来撑起 */
  .wheel {
    position: relative;
    width: 90%;
    padding-top: 90%;
    margin: 0 auto;
    overflow: hidden;

    .round {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      /* 抽完奖后复位时，旋转不需要过渡时间 */
      &.not_roting {
        transition: 0s !important;
      }

      .prize {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        .item_box {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;

          .item {
            position: absolute;
            top: calc(85 / 675 * 100%);
            left: calc((1 - 145 / 675) * 100% * 0.5);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: calc(145 / 675 * 100%);

            .text {
              font-size: calc(100vw * 25 / 750);
              font-weight: bold;
              line-height: 1;

              @media (min-width: 500px) {
                font-size: 17px;
              }
            }

            .img {
              width: calc(90 / 145 * 100%);
              margin-top: calc(30 / 145 * 100%);
            }
          }
        }
      }
    }

    /* LOGO 居中 */
    .icon {
      position: absolute;
      top: 50%;
      left: 50%;
      width: calc(155 / 675 * 100%);
      transform: translate(-50%, -50%);
    }

    /* 箭头顶部居中 */
    .arrow {
      position: absolute;
      top: calc(10 / 675 * 100%);
      left: 50%;
      width: calc(55 / 675 * 100%);
      transform: translateX(-50%);
    }
  }

  .btn {
    width: 100%;
    margin-top: calc(40 / 750 * 100%);

    > button {
      display: block;
      width: calc(650 / 750 * 100%);
      line-height: 2;
      margin: auto;
    }
  }
}
</style>
