<template>
  <div class="scroll-container" ref="scrollContainer" @wheel.prevent="handleScroll" >
    <div class="scroll-wrapper" ref="scrollWrapper" :style="{top: top + 'px'}">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
const delta = 15
@Component
export default class ScollBar extends Vue {
  top: number = 0
  handleScroll(e) {
    const eventDelta = e.wheelDelta || -e.deltaY * 3
    const $container: any = this.$refs.scrollContainer
    const $containerHeight = $container.offsetHeight
    const $wrapper: any = this.$refs.scrollWrapper
    const $wrapperHeight = $wrapper.offsetHeight
    if (eventDelta > 0) {
      this.top = Math.min(0, this.top + eventDelta)
    } else {
      if ($containerHeight - delta < $wrapperHeight) {
        if (this.top < -($wrapperHeight - $containerHeight + delta)) {
          this.top = this.top
        } else {
          this.top = Math.max(this.top + eventDelta, $containerHeight - $wrapperHeight - delta)
        }
      } else {
        this.top = 0
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '../../styles/variables.scss';

.scroll-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: $menuBg;
  .scroll-wrapper {
    position: absolute;
     width: 100%!important;
  }
}
</style>
