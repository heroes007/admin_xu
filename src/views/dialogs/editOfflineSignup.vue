<template>
    <el-dialog title="编辑回执" v-model="editOfflineSignupDialog" :show-close="false" @close="handleRemoveModal(remove)" size="auto"
        :closeOnClickModal="false">
        <base-input @closedialog="handleClose" :baseInputWidth="500">
            <Row slot="body">
                <Form :model="formInline1" class="row1-test-form" label-width="80px">
                    <FormItem label="姓名">
                        <el-input v-model="formInline1.name" placeholder="请输入姓名"></el-input>
                   </FormItem>
                    <FormItem label="性别">
                        <el-radio-group v-model="formInline1.sex" :disabled="disabled">
                            <el-radio :label="0">女</el-radio>
                            <el-radio :label="1">男</el-radio>
                        </el-radio-group>
                   </FormItem>
                    <FormItem label="身份证号">
                        <el-input v-model="formInline1.idcard" placeholder="请输入身份证号"></el-input>
                   </FormItem>
                    <FormItem label="联系电话">
                        <el-input v-model="formInline1.phone" placeholder="请输入联系电话"></el-input>
                   </FormItem>
                    <FormItem label="E-mail">
                        <el-input v-model="formInline1.email" placeholder="请输入邮箱地址"></el-input>
                   </FormItem>
                    <FormItem label="选择城市">
                        <el-select v-model="formInline1.estimate_set_out_province_id" placeholder="请选择" @change="handleSelectedProvince">
                            <el-option v-for="(item, index) in privinceList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                        <el-select v-model="formInline1.estimate_set_out_city_id" placeholder="请选择">
                            <el-option v-for="(item, index) in cities" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                   </FormItem>
                    <FormItem label="出发时间">
                        <el-date-picker v-model="formInline1.estimate_set_out_time" type="date" placeholder="选择日期">
                        </el-date-picker>
                   </FormItem>
                    <FormItem class="btn-content">
                        <Button type="primary" class="sub-btn" @click="saveHandler">保存</Button>
                   </FormItem>
                </Form>
            </Row>
        </base-input>
        </el-dialog>
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
<style lang="scss">
    #edit-offline-signup-container {
        @import "base.scss";
        input,
        textarea {
            resize: none;
            outline: none;
        }
        .el-dialog {
            .el-dialog__header {
                background: #333333;
                border-radius: 4px 4px 0 0;
                padding: 16px;
            }
            .el-dialog__body {
                padding: 0;
                background: #fff;
                border-radius: 0 0 4px 4px;
                .row1-test-form {
                    // height: 97px;
                    width: 80%;
                    margin: 0 auto;
                    border-bottom: 1px solid #E5E5E5;
                    background: #fff;
                    margin-top: 31px;
                    padding-bottom: 18px;
                    label {
                        font-size: 14px;
                        color: #141111;
                        letter-spacing: 0;
                    }

                    .el-form-item__content {
                        text-align: left;
                        padding-left: 20px;

                        .el-select {
                            width: 30%;

                            .el-input {
                                width: 100%;
                            }
                        }
                    }
                    
                    .el-input {
                        width: 250px;
                        height: 36px;
                        input {
                            border-radius: none;
                        }
                    }
                    .el-input__inner {
                        border-radius: 0;
                    }
                    .save-test {
                        .el-form-item__content {
                            margin-left: 30px !important;
                        }
                    }
                    .btn-content {
                        margin-top: 50px;
                        .el-form-item__content {
                            margin-left: 0 !important;
                            line-height: 0;
                            text-align: center;
                            button {
                                margin-left: 0;
                                background: #FB843E;
                                border-radius: 4px;
                                width: 200px;
                                height: 36px;
                                border: 0;
                            }
                        }
                    }
                }
            }
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
</style>