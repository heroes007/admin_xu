<template>
    <Modal title="编辑回执" v-model="editOfflineSignupDialog" :footer-hide="true" @on-cancel="handleRemoveModal(remove)"  :styles="{width: '600px'}"
        :mask-closable="false">
        <base-input @closedialog="handleClose" :baseInputWidth="600">
            <div slot="body">
                <Form :model="formInline1" class="row1-test-form" :label-width="180">
                    <FormItem label="姓名">
                        <Input v-model="formInline1.name" placeholder="请输入姓名"></Input>
                   </FormItem>
                    <FormItem label="性别">
                        <RadioGroup v-model="formInline1.sex" :disabled="false">
                            <Radio :label="0">女</Radio>
                            <Radio :label="1">男</Radio>
                        </RadioGroup>
                   </FormItem>
                    <FormItem label="身份证号">
                        <Input v-model="formInline1.idcard" placeholder="请输入身份证号"></Input>
                   </FormItem>
                    <FormItem label="联系电话">
                        <Input v-model="formInline1.phone" placeholder="请输入联系电话"></Input>
                   </FormItem>
                    <FormItem label="E-mail">
                        <Input v-model="formInline1.email" placeholder="请输入邮箱地址"></Input>
                   </FormItem>
                    <FormItem label="选择城市">
                        <Select v-model="formInline1.estimate_set_out_province_id" placeholder="请选择" @change="handleSelectedProvince">
                            <Option v-for="(item, index) in privinceList" :key="item.id" :label="item.name" :value="item.id">
                            </Option>
                        </Select>
                        <Select v-model="formInline1.estimate_set_out_city_id" placeholder="请选择">
                            <Option v-for="(item, index) in cities" :key="item.id" :label="item.name" :value="item.id">
                            </Option>
                        </Select>
                   </FormItem>
                    <FormItem label="出发时间">
                        <DatePicker v-model="formInline1.estimate_set_out_time" type="date" placeholder="选择日期" :transfer="true">
                        </DatePicker>
                   </FormItem>
                    <FormItem class="btn-content">
                        <Button type="primary" class="sub-btn" @click="saveHandler">保存</Button>
                   </FormItem>
                </Form>
            </div>
        </base-input>
        </Modal>
</template>

<script>
    import BaseInput from '../../components/BaseInput'
    import BaseList from '../../components/BaseList'
    import {
        RemoveModal
    } from './mixins'
        import {
    MPop
} from '../../components/MessagePop'
    export default {
        mixins: [RemoveModal,MPop],
        props: {
            remove: {
                type: String
            },
            payload: {
            }
        },
        components: {
            'base-input': BaseInput,
            'data-list': BaseList
        },
        data() {
            return {
                editOfflineSignupDialog: true,
                formInline1: {
                    otr_id: 0,
                    name: '',
                    sex: 1,
                    idcard: '',
                    phone: '',
                    email: '',
                    estimate_set_out_city_id: 0,
                    estimate_set_out_province_id: 0,
                    estimate_set_out_time: null,
                },
                cities: []
            }
        },
        computed: {
            cityList() {
                return this.$store.state.city.city_list;
            },
            privinceList() {
                 var city_tree_data = [];
                 for (let c of this.cityList) {
                        if (c.r_level == 1) {
                            let n_c = c;
                            n_c.cities = [];
                            city_tree_data.push(n_c);
                        }
                    }

                    for (let c of this.cityList) {
                        if (c.r_level == 2) {
                            for (let p of this.cityList) {
                                if (p.id == c.parent_id) {
                                    p.cities.push(c);
                                    break;
                                }
                            }
                        }
                    }

                    this.cities = this.cityList;
                return city_tree_data;
            },
        },
        methods: {
            handleClose() {
                this.editOfflineSignupDialog = false;
            },
            saveHandler() {
                this.$store.dispatch('update_offline_course_receipt',this.formInline1);
            },
            handleSelectedProvince() {
                if(this.idx == 0){
                    this.idx++
                    return false;
                }
                var prs = this.privinceList;
                prs.map(item => {
                    if (item.id == this.formInline1.estimate_set_out_province_id) {
                        this.cities = item.cities;
                        this.formInline1.estimate_set_out_city_id = item.cities[0].id;
                    }
                })
            }
        },
        mounted() {
            this.formInline1.otr_id = this.payload.otr_id;
            this.formInline1.name = this.payload.name;
            this.formInline1.idcard = this.payload.idcard;
            this.formInline1.email = this.payload.email;
            this.formInline1.phone = this.payload.phone;
            this.formInline1.sex = this.payload.sex;
            this.formInline1.estimate_set_out_city_id = this.payload.estimate_set_out_city_id;
            this.formInline1.estimate_set_out_province_id = this.payload.estimate_set_out_province_id;
            this.formInline1.estimate_set_out_time = this.payload.estimate_set_out_time;
            var vm = this;
            this.formInline1.callback = function(){
                vm.handleClose();
                vm.showPop('保存成功！',1000);
            }
        }
    }

</script>
<style scoped lang="scss">
    #edit-offline-signup-container {
        @import "base.scss";
        input,
        textarea {
            resize: none;
            outline: none;
        }
        .close-dialog-panel {
            position: absolute;
            top: -40px;
            right: 13.5px;
            z-index: 99999;
            font-size: 30px;
            cursor: pointer;
            &:before {
                // color: #fff;
                color: #757575;
            }
        }
    }
    .row1-test-form{
        display: flex;
        flex-direction: column;
        align-items: start;
    }
</style>
