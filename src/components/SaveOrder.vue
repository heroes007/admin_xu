<template>
    <div class='save-order'>
        <!--<div class='save' @click='clickHandler'>
            <p>...</p>
            <p>保存顺序</p>
        </div>-->
        <Row>
            <Button class='btn-cancel' type='primary' :plain='true' @click='cancelHandler'>取消</Button>
            <Button class='btn-save' type='primary' :plain='true' @click='saveHandler'>保存</Button>
        </Row>
    </div>
</template>

<script>
    export default{
        data(){
            return{

            }
        },
        methods:{
            saveHandler(){
                this.$emit('saveOrder');
            },
            cancelHandler(){
                this.$emit('cancelChange');
            }
        }
    }
</script>
<style lang='scss'>
    .save-order {

        .btn-cancel {
            /*border-color: #1e1e1e;*/
        }
        .btn-save {
            border-color: #F06B1D;
            color: #fff;
        }

        .save {
            position: fixed;
            top:40%;
            right: 10px;
            background-color: #FB843E;
            box-shadow: 0 0 20px 0 rgba(251,131,62,0.50);
            border-radius: 50%;
            width: 70px;
            height: 70px;
            cursor: pointer;

            p {
                font-size: 12px;
                color: #FFFFFF;
                letter-spacing: 0;
                width: 100%;
                text-align: center;
                margin: 5px 0;

                &:first-child {
                    font-size: 24px;
                    margin-bottom: 2px;
                }

                &:last-child {
                    margin-top: 2px;
                }
            }
        }
    }
</style>
