<template>
  <div>
    <el-popover
      v-model="visible"
      placement="bottom"
      title="选择图标"
      width="400"
      trigger="manual"
    >
      <div class="icon-content">
        <div class="icons-container">
          <div class="grid">
            <div v-for="item of elementIcons" :key="item">
              <div class="icon-item" @click="selectIcon('el-icon-' + item)">
                <i :class="'el-icon-' + item" />
              </div>
            </div>
          </div>
          <div class="grid">
            <div v-for="item of svgIcons" :key="item">
              <div class="icon-item" @click="selectIcon(item)">
                <svg-icon :icon-class="item" class-name="disabled" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-button v-if="!icon" slot="reference" @click="visible = !visible">选择</el-button>
      <el-button v-else-if="icon.indexOf('el-icon') >= 0" slot="reference" :icon="icon" @click="visible = !visible">选择</el-button>
      <el-button v-else slot="reference" @click="visible = !visible"><svg-icon :icon-class="icon" class-name="disabled" /> 选择</el-button>
    </el-popover>
  </div>

</template>

<script>
import svgIcons from './svg-icons'
import elementIcons from './element-icons'

export default {
  name: 'Icons',
  data() {
    return {
      svgIcons,
      elementIcons,
      icon: null,
      visible: false
    }
  },
  methods: {
    // // 选中图标的回调
    // checkIcon(icon) {
    //   console.log(icon)
    //   //this.sysMenu.menuIcon=icon
    //   this.$set(this.sysMenu, 'menuIcon', icon)
    // },
    // 选中图标
    selectIcon(icon) {
      this.visible = !this.visible
      this.icon = icon
      this.$emit('checkIcon', icon)
    }
  }
}
</script>

<style lang="scss" scoped>
.icons-container {
  overflow: hidden;

  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  }

  .icon-item {
    height: 40px;
    text-align: center;
    width: 40px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }
}
.icon-content {
  max-height: 400px;
  overflow-y: scroll;
}
</style>