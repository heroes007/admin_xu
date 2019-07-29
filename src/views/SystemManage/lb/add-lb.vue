<template>
    <div>
        <screen :types="7" @handleBack="handleBack" title="首页广告图"/>
        <Form :model="formLb">
            <FormItem label="广告名称" prop>
                <Input v-model="formLb.title"/>
            </FormItem>
            <FormItem label="状态" prop>
                <Input v-model="formLb.state"/>
            </FormItem>
            <FormItem label="跳转类型" prop>
                <RadioGroup v-model="formLb.jumpState">
                    <Radio label="1">课程</Radio>
                    <Radio label="2">培训</Radio>
                    <Radio label="3">合集</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="所属机构" prop>
                <Select v-model="formLb.cuId" style="width:200px">
                    <Option v-for="item in crList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="跳转页面" prop>
                <Select v-model="formLb.htmlId" style="width:200px">
                    <Option v-for="item in crList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    import screen from '../../../components/ScreenFrame'

    export default {
        components: {screen},
        data() {
            return {
                formLb: {
                    title: '',
                    state: '',
                    jumpState: '1',
                    cuId: '',
                    htmlId: '',
                },
                crList: [
                    {value: 1, label: "机构1"},
                    {value: 2, label: "机构2"},
                    {value: 3, label: "机构3"},
                    {value: 4, label: "机构4"},
                ]
            }
        },
        methods: {
            handleBack() {
                this.$router.go(-1)
            }
        }
    }
</script>

<style scoped lang="less">
    .screen{
        background-color: #fff;
        box-shadow: 0 0 8px 0 rgba(0,0,0,0.19);
    }
</style>
