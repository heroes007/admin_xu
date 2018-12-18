<template>
<el-row class="base-input-container" :style="{ width: baseInputWidth + 'px' }">
    <el-row class='body-header'>
        <slot name="header"></slot>
    </el-row>
    <el-row class="body-content">
        <span class="xght-webfont-close-sign close-dialog-panel" @click="closeDialog"></span>
        <slot name="body"></slot>
    </el-row>
</el-row>
</template>

<script>
export default {
    props: {
        baseInputWidth: {
            type: Number
        }
    },
    data() {
        return {

        }
    },
    methods: {
      closeDialog(){
        this.$emit('closedialog')
      }
    }
}
</script>

<style lang="scss">
  .base-input-container{
    margin: 0 auto;

    .body-header {
        h3 {
            margin: 0;
            text-align: left;
            color:#5fa137;
            font-weight: 200;
        }
    }
  }

</style>
