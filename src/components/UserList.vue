    <template>
    <div class='list-container'>
        <Row class='search-bar' type='flex' justify='space-between' align='middle'>
            <Col>
                <input placeholder='搜索学员姓名' v-model='m_search_data'/>
            </Col>
            <Col>
                <Button type='text' icon='search' @click='doSearch'>
                </Button>
            </Col>
        </Row>
        <Row class='header-bar' type='flex' justify='left' align='middle'>
            <Col>
                <el-checkbox v-model="checkAll" :disabled='users.length === 0'></el-checkbox>
            </Col>
            <Col>
                日期
            </Col>
            <Col>
                姓名
            </Col>
            <Col>
                <Row class='header-bar' type='flex' justify='center' align='middle'>
                    学科
                    <div class='arrow'>
                        <i class='el-icon-caret-top'></i>
                        <i class='el-icon-caret-bottom'></i>
                    </div>
                </Row>
            </Col>
        </Row>
        <Row class='list-row' type='flex' justify='left' align='middle' v-for='item in users' :key="item.id">
            <Col>
                <el-checkbox v-model='item.checked' @change='selectChange'></el-checkbox>
            </Col>
            <Col>
                {{item.start_school_time | zonetime}}
            </Col>
            <Col>
                {{item.realname}}
            </Col>
            <Col>
                <subject-filter :sid='item.subject_id'></subject-filter>
            </Col>
        </Row>
        <Row class='footer-bar' type='flex' justify='center' align='middle'>
        <!--    <Button type='text'>确认</a>-->
        </Row>
    </div>
</template>

<style lang="scss">
    .list-container {
        min-width:414px;
        border:1px solid #cecece;

        .search-bar {
            padding:0 10px;
            .Col {
                text-align:left;
                padding-right:37px;
                &:last-child {
                    text-align:right;
                    width:50px;
                    padding-right:0;
                    .el-button {
                        font-size:24px;
                        color:#cecece;
                    }
                }
                input {
                    border:0;
                    outline:0;
                    width:100%;
                    height:36px;
                    padding:3px 10px;
                    font-size:inherit;
                    text-align:right;
                    &:focus {
                        outline:0;
                    }
                }
            }
        }
        .header-bar {
            height:44px;
            border-top:1px solid #cecece;
            border-bottom:1px solid #cecece;
            background-color:#E0E6ED;
            color:#475669;

            .Col {
                .arrow {
                    display:inline;
                    margin-left:10px;

                    i {
                        font-size:7px;
                        display:block;
                    }
                }
            }
        }
        .list-row {
            height:44px;
            padding:5px 0;
            border-bottom:1px solid #cecece;
            .Col {
                color:#1F2D3D;
                font-size:14px;
                div {
                    width:48px;
                    height:24px;
                    line-height:24px;
                    background-color:#e8f5ff;
                    border:1px solid #bfe4ff;
                    color:#20a0ff;
                    font-size:12px;
                    border-radius:5px;
                    display:inline-block;
                }
            }
        }
        .footer-bar {
            height:50px;
            .el-button {
                color:#61a136;
            }
        }
    }
</style>

<script>
    import api from '../api/modules/config'
    import SubjectFilter from '../components/SubjectFilter.vue'
    export default{
        components: { 'subject-filter': SubjectFilter },
        data(){
            return{
                m_search_data: '',
                users: [],
                checkAll: false
            }
        },
        props:['searchRange'],
        watch:{
            searchRange() {
                this.doSearch();
            },
            checkAll(val) {
                for(var i=0;i<this.users.length;i++){
                    this.users[i].checked = val;
                }
                this.selectChange();
            }
        },
        methods:{
            doSearch() {
                api.post('api/user_student_mrzx/get_user_student_list_by_start_time',
                    {start_time:this.searchRange[0],
                    end_time:this.searchRange[1],
                    realname:this.m_search_data}).then((res) => {
                    if(res.data.res_code === 1){
                        this.users = res.data.msg;
                        for(var i=0;i<this.users.length;i++){
                            this.$set(this.users[i],'checked',true)
                        }
                        this.checkAll = true;
                        this.selectChange();
                    }
                });
            },
            selectChange(){
                var selectUsers = [];
                for(var i=0;i<this.users.length;i++){
                    if(this.users[i].checked){
                        selectUsers.push(this.users[i].user_id);
                    }
                }
                this.$emit('listChange',selectUsers);
            }
        }
    }
</script>
