<template>
    <div class='manage-production-view'>
        <screen :btn-type='true' :select-type1="true" :select-type2="true" :types="4" size-title1="管理总数" :size-num1="total" btn-name="添加管理" :select1="selectList" :select2="selectList2"
                @selectChange1="selectChange1"  @selectChange2="selectChange2" @inputChange="inputChange" @handleClick="handleClick"/>
        <Row style="padding-top:20px;display:flex;flex-wrap:wrap;">
             <Card style="min-width:350px;min-height:127px;margin:20px;" v-for="(t, index) in cardList" :key="index" @click.native="handleJump(t)">
                  <Row>
                    <Col span="2" class="al-left cad-top-left" >
                     <p>ID:</p>
                    </Col>
                    <Col span="9" class="al-left cad-top-left" >
                      <p>{{t.id}}</p>
                    </Col>
                    <Col span="13" class="al-right" >
                        <div class="cad-top-right">{{t.stateText}}</div>
                    </Col>
                  </Row>
                  <Row>
                    <h2 class="product-title">{{t.title}}</h2>
                  </Row>
                  <Row>
                     <Col span="4" class="al-left cad-btm-price">¥{{t.price}}</Col>
                     <Col span="4" class="al-left cad-btn-relprice">¥{{t.original_price}}</Col>
                     <Col span="16" class="al-right cad-btn-people">{{t.join_number}}人报名</Col>
                  </Row>
             </Card>
        </Row>
         <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>

<script>
  import screen from '../../components/ScreenFrame'
  import postData from '../../api/postData'
  import pageList from '../../components/Page'
  import pageMixin from '../mixins/pageMixins'
  export default {
    mixins: [pageMixin],
    components: { screen, pageList },
    data() {
      return {
        curPage: 1,
        cardList: [],
        search: '',
        selectList: [],
        selectList2: [],
        courseNums:12
      };
    },
    methods: {
      selectChange1(val){
        console.log(val)
      },
      selectChange2(val){
        console.log(val)
      },
      inputChange(val){
        this.search = val;
        this.getList()
      },
      handleClick(){
        console.log('open modal')
      },
      handleJump(t){
        localStorage.setItem('PRODUCTINFO',JSON.stringify(t))
        let routeData = this.$router.resolve({
          query: '',
          params: '',
          name: "open-product",
        });
        window.open(routeData.href, "_blank")
      },
      handleCurrentChange(val) {
        this.curPage = val;
        var data = this.getData();
      },
      getDeptAdminList(){
         postData('/user/getDeptAdminList',{page_size:100, page_num:1}).then((res) => {
          this.selectList = res.data.list
        })
      },
      getList(){
        let organization_id = localStorage.getItem('organization_id') !== 1 ? localStorage.getItem('organization_id') : ''
        let d = {
          organization_id,
          // state: 1,
          search: "",
          page_size: this.pageSize,
          page_num: this.current,
        }
        postData('/product/product/get_list',d).then((res) => {
         this.cardList = res.data.data
         this.cardList.map((t) => {
           t.stateText = this.$config.setProductState(t.state)
         })
         this.total = res.data.count
        })
      }
    },
    mounted() {
      this.getList()
      this.getDeptAdminList()
    }
  };
</script>
<style lang="scss" scoped>
    .manage-production-view {
      background: #f0f0f7;
      min-height: 1200px;
      position: relative;
        .base-list-container {
            .base-list-row {
                height: 60px;
            }
        }

        .find-by-term {
            padding-top: 22px;
            text-align: left;
            margin-left: 20px;

            /deep/ .ivu-input {
                width: 200px;
            }

            button {
                background: #3DAAFF;
                border: 1px solid #3DAAFF;
                border-radius: 4px;
                width: 100px;
                height: 36px;
            }
        }

        .data-container {
            background-color: #ffffff;
            margin: 0 20px 20px;

            .list {
                .data-header {
                    height: 50px;

                    .Col {
                        line-height: 50px;
                    }
                }

                .data-item {
                    height: 40px;
                    border-top: 1px solid #cecece;

                    &.bg-gray {
                        background-color: #fbfbfb;
                    }

                    .Col {
                        line-height: 40px;

                        p {
                            margin: 0;
                            display: -webkit-box;
                            white-space: normal;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                            -webkit-line-clamp: 1;
                        }
                    }
                }

                .pager {
                    margin: 30px 0;
                    padding-right: 40px;
                }
            }
        }
        .al-left{
          text-align: left;
        }
        .al-right{
          text-align: right;
        }
        .cad-top-left{
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #474C63;
          letter-spacing: 0;
        }
        .cad-top-right{
          width: 50px;
          height: 20px;
          float: right;
          background: #74C818;
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #FFFFFF;
          letter-spacing: 0;
          text-align: center;
          border-radius: 20px;
        }
        .cad-btm-price{
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: #F54802;
          letter-spacing: 0;
        }
        .cad-btn-relprice{
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: #474C63;
          letter-spacing: 0;
          text-decoration: line-through;
        }
        .cad-btn-people{
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #474C63;
          letter-spacing: 0;
        }
    }
    .product-title{
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: #474C63;
        letter-spacing: 0;
        text-align: left;
        margin:15px 0
    }
    /deep/ .ivu-page{
      position: absolute;
      bottom: 250px;
      left: 0;
      right: 0;
      margin: 0 auto;
    }
</style>