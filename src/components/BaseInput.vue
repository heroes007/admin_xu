<template>
<Row class="base-input-container" :style="{ width: baseInputWidth + 'px' }">
    <Row class='body-header'>
        <slot name="header"></slot>
    </Row>
    <Row class="body-content">
        <span class="xght-webfont-close-sign close-dialog-panel" @click="closeDialog"></span>
        <slot name="body"></slot>
    </Row>
</Row>
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
