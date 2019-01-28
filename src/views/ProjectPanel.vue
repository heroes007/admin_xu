<template>
    <Row class="project">
        <Col :span="4" class="project-left"><side-menu /></Col>
        <Col :span="20" class="project-right"><project-list/></Col>
    </Row>
</template>
<script>
    import { mapState,  mapActions } from 'vuex'
    import { Config } from '../config/base'
    import { doTimeFormat } from '../components/Util'
    import SideMenu from '../components/SideMenuForProject'
    import ProjectList from '../components/ProjectList'
    export default {
        components: { 'side-menu': SideMenu, 'project-list':ProjectList },
        data() {
            return { loadingInstance: null }
        },
        computed: {
            ...mapState({
                projectList: state => state.project.project_list,
                isLoading: state => state.project.isLoading
            })
        },
        filters: {
            Numfilter(v) {
                var _v = v + 1;
                return _v > 10 ? _v : '0' + _v;
            }
        },
        methods: {
            ...mapActions([ 'get_project_list', 'change_selected_project_id' ]),
            changeSelectProject(id) {
                this.change_selected_project_id(id);
                this.$router.replace({ path: 'dashboard' });
            },
            getCreateTime(time) {
                return doTimeFormat(time);
            }
        },
        watch: {
            isLoading(val) {
                 if (val) {
                   this.loadingInstance = this.$LoadingY({message: "加载中，请稍后",show: true})
                    setTimeout(() => {
                        this.loadingInstance.close()
                    }, Config.base_timeout);
                }else if(this.loadingInstance) this.loadingInstance.close()
            }
        },
        mounted() {
            this.get_project_list();
        }
    }
</script>

<style lang="scss">
    .project {
        height: 100% !important;
        .project-left {
            height: 100%;
            background-color: #333;
        }
        .project-right {
            .project-panel {
                width: 100%;
                height: 100vh;
                background: #F9F9F9;
                h1 {
                    margin-top: 0;
                    font-size: 48px;
                    color: #333333;
                    letter-spacing: 0;
                    margin-bottom: 0;
                    padding-top: 60.2px;
                }
                h1+p {
                    font-size: 16px;
                    color: #333333;
                    letter-spacing: 0;
                }
                .project-list {
                    text-align: left;
                    padding: 20px;
                    .project-item {
                        cursor: pointer;
                        display: inline-block;
                        width: 350px;
                        height: 180px;
                        margin: 20px;
                        border: 0;
                        border-top: 5px solid #F06B1D;
                        background: #FFFFFF;
                        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.10);
                        border-radius: 5px;
                        .xght-webfont-tag{
                            &:before{
                                color: #F06B1D;
                            }
                        }
                        h3 {
                            margin-top: 60px;
                            position: relative;
                            span {
                                opacity: 0.1;
                                font-size: 100px;
                                color: #F06B1D;
                                letter-spacing: 0;
                                position: absolute;
                                right: 0;
                                bottom: -20px;
                            }
                        }
                        h3,
                        p {
                            text-align: left;
                        }
                        p {
                            border-top: 1px solid #E5E5E5;
                            padding-top: 18px;
                        }
                    }
                }
            }
        }
    }
</style>