<template>
 <div>
    <div class="col-1">天涯</div>
    <div class="col-2">天涯</div>
    <div class="col-3">天涯</div>

    <div class="title-one">天涯</div>
    <div class="title-two">天涯</div>
    <div class="title-three">天涯</div>
 </div>
</template>

<script>
  export default {
    data(){
        return{
            text: '辅导老师后台首页'
        }
    },
    methods: {
    },
    mounted() {

    }
  }
</script>
<style lang="less" scoped>
@selectors-size: 12, 16, 32;
@selectors-color: red, blue, yellow;
each(range(3), {
  .col-@{value} {
    width: (@value * 50px);
    height: (@value * 50px);
    background: extract(@selectors-color, @value);
    font-size: extract(@selectors-size, @value) * 1px;
  }
});
// 输出 .col-1 .col-2 .col-3

.class-name(){ one: 32; two: 16; three: 12; }
each(.class-name(), .(@v, @k, @i){
  .title-@{k} {
     font-size: @v * 1px;
     color: extract(@selectors-color, @i);
  }
})

// 输出 .title-one .title-two .title-three
</style>

