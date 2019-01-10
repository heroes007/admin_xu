<template>
    <div class='holy-water-view' :class="{'is-phone-view':isPhone}">
        <div class='img-list' :class="{'blur':showDetail}">
            <img-item @showDetail='showDetailHandler' v-for='item in dataList' :key="item.id" :imgUrl='item.imgUrl' :id='item.id'></img-item>
        </div>
        <div class='carousel-container' v-show='showDetail' @click="hideHandler">
            <Row type='flex' align='middle'>
                <Col class='btn' :span='2' :offset="1" v-if='!isPhone'>
                    <!-- <img src='../assets/img/pre.png' @click.stop='preHandler'> -->
                </Col>
                <Col :span='isPhone?24:16' :push='isPhone?0:1'>
                    <el-carousel :style='carouselStyle' ref='mySwaper' :height="carouselHeight + 'px'" :autoplay="false" arrow="never" indicator-position='none'>
                        <el-carousel-item v-for="item in detailList" :key="item.id">
                            <Row class='title'><p>测试文字撒打算打算打算打算打算打</p></Row>
                            <Row class='content' v-if='!isPhone' type='flex' align='middle' justify='center'>
                                <img :style='{width:getImgWidth(item),height:getImgHeight(item)}' @click.stop :src='item.url' v-if="item.type==='image'" />
                                <video id='myVideo' @click.stop :src="item.url" controls="controls" v-if="item.type==='video'" />
                            </Row>
                            <v-touch class='content' @swipeleft="nextHandler" @swiperight='preHandler' v-if='isPhone'>
                                <Row class='content' type='flex' align='middle' justify='center'>
                                    <img :style='{width:getImgWidth(item),height:getImgHeight(item)}' @click.stop :src='item.url' v-if="item.type==='image'" />
                                    <video id='myVideo' @click.stop :src="item.url" controls="controls" v-if="item.type==='video'" />
                                </Row>
                            </v-touch>
                                                      <Row class='title'><p>测试文字撒打算打算打算打算打算打</p></Row>
                        </el-carousel-item>
                    </el-carousel>
                </Col>
                <Col class='btn' :span='2' :push='2' v-if='!isPhone'>
                    <!-- <img src='../assets/img/next.png' @click.stop='nextHandler' /> -->
                </Col>
            </Row>
        </div>
    </div>
</template>

<script >
// import HolyImage from '../components/HolyImage'
// import img1 from '../assets/img/1.jpg'
// import img2 from "../assets/img/2.jpg"
// import img3 from "../assets/img/3.jpg"
// import img4 from "../assets/img/4.jpg"
// import img5 from "../assets/img/5.jpg"
// import img6 from "../assets/img/6.jpg"
// import img7 from "../assets/img/7.jpg"
// import img8 from "../assets/img/8.jpg"
// import img9 from "../assets/img/9.jpg"
// import img10 from "../assets/img/10.jpg"
// import img11 from "../assets/img/11.jpg"
// import img12 from "../assets/img/12.jpg"
// import img13 from "../assets/img/13.jpg"
// import img14 from "../assets/img/14.jpg"
// import img15 from "../assets/img/15.jpg"
// import img16 from "../assets/img/16.jpg"
// import img17 from "../assets/img/17.jpg"
// import img18 from "../assets/img/18.jpg"
// import img19 from "../assets/img/19.jpg"
// import img20 from "../assets/img/20.jpg"
// import img21 from "../assets/img/21.jpg"

// import img1_1 from "../assets/img/1/1-1.jpg"
// import img2_1 from "../assets/img/2/2-1.jpg"
// import img2_2 from "../assets/img/2/2-2.jpg"
// import img3_1 from "../assets/img/3/3-1.jpg"
// import img3_2 from "../assets/img/3/3-2.jpg"
// import img3_3 from "../assets/img/3/3-3.jpg"
// import img4_1 from "../assets/img/4/4-1.jpg"
// import img4_2 from "../assets/img/4/4-2.jpg"
// import img4_3 from "../assets/img/4/4-3.jpg"
// import img4_4 from "../assets/img/4/4-4.jpg"
// import img4_5 from "../assets/img/4/4-5.jpg"
// import img4_6 from "../assets/img/4/4-6.jpg"
// import img4_7 from "../assets/img/4/4-7.jpg"
// import img4_8 from "../assets/img/4/4-8.jpg"
// import img4_9 from "../assets/img/4/4-9.jpg"
// // import img5_1 from "../assets/img/5/5-1.mp4"
// import img6_1 from "../assets/img/6/6-1.jpg"
// import img6_2 from "../assets/img/6/6-2.jpg"
// import img6_3 from "../assets/img/6/6-3.jpg"
// import img6_4 from "../assets/img/6/6-4.jpg"
// import img6_5 from "../assets/img/6/6-5.jpg"
// import img6_6 from "../assets/img/6/6-6.jpg"
// import img7_1 from "../assets/img/7/7-1.jpg"
// import img7_2 from "../assets/img/7/7-2.jpg"
// import img7_3 from "../assets/img/7/7-3.jpg"
// import img7_4 from "../assets/img/7/7-4.jpg"
// import img7_5 from "../assets/img/7/7-5.jpg"
// import img8_1 from "../assets/img/8/8-1.jpg"
// import img8_2 from "../assets/img/8/8-2.jpg"
// import img8_3 from "../assets/img/8/8-3.jpg"
// import img8_4 from "../assets/img/8/8-4.jpg"
// import img8_5 from "../assets/img/8/8-5.jpg"
// import img8_6 from "../assets/img/8/8-6.jpg"
// // import img8_7 from "../assets/img/8/8-7.mp4"
// import img9_1 from "../assets/img/9/9-1.jpg"
// import img9_2 from "../assets/img/9/9-2.jpg"
// // import img10_1 from "../assets/img/10/10-1.mp4"
// import img11_1 from "../assets/img/11/11-1.jpg"
// import img11_2 from "../assets/img/11/11-2.jpg"
// import img11_3 from "../assets/img/11/11-3.jpg"
// import img11_4 from "../assets/img/11/11-4.jpg"
// import img11_5 from "../assets/img/11/11-5.jpg"
// import img12_1 from "../assets/img/12/12-1.jpg"
// import img12_2 from "../assets/img/12/12-2.jpg"
// // import img13_1 from "../assets/img/13/13-1.mp4"
// import img14_1 from "../assets/img/14/14-1.jpg"
// import img14_2 from "../assets/img/14/14-2.jpg"
// // import img14_3 from "../assets/img/14/14-3.mp4"
// // import img15_1 from "../assets/img/15/15-1.mp4"
// import img16_1 from "../assets/img/16/16-1.jpg"
// import img16_2 from "../assets/img/16/16-2.jpg"
// import img16_3 from "../assets/img/16/16-3.jpg"
// import img16_4 from "../assets/img/16/16-4.jpg"
// import img16_5 from "../assets/img/16/16-5.jpg"
// import img16_6 from "../assets/img/16/16-6.jpg"
// import img16_7 from "../assets/img/16/16-7.jpg"
// import img16_8 from "../assets/img/16/16-8.jpg"
// import img16_9 from "../assets/img/16/16-9.jpg"
// import img17_1 from "../assets/img/17/17-1.jpg"
// import img17_2 from "../assets/img/17/17-2.jpg"
// import img17_3 from "../assets/img/17/17-3.jpg"
// import img17_4 from "../assets/img/17/17-4.jpg"
// import img17_5 from "../assets/img/17/17-5.jpg"
// import img18_1 from "../assets/img/18/18-1.jpg"
// import img18_2 from "../assets/img/18/18-2.jpg"
// import img18_3 from "../assets/img/18/18-3.jpg"
// import img18_4 from "../assets/img/18/18-4.jpg"
// import img18_5 from "../assets/img/18/18-5.jpg"
// // import img18_6 from "../assets/img/18/18-6.mp4"
// import img19_1 from "../assets/img/19/19-1.jpg"
// import img19_2 from "../assets/img/19/19-2.jpg"
// // import img20_1 from "../assets/img/20/20-1.mp4"

import { mapState } from 'vuex'

export default {
    data() {
        return {
            dataList: [
                // {
                //     id: 1, imgUrl: img1, detailList: [
                //         { id: 1, type: 'image', url: img1_1 }
                //     ]
                // },
                // {
                //     id: 2, imgUrl: img2, detailList: [
                //         { id: 1, type: 'image', url: img2_1 },
                //         { id: 2, type: 'image', url: img2_2 }
                //     ]
                // },
                // {
                //     id: 3, imgUrl: img3, detailList: [
                //         { id: 1, type: 'image', url: img3_1 },
                //         { id: 2, type: 'image', url: img3_2 },
                //         { id: 3, type: 'image', url: img3_3, isVertical: true }
                //     ]
                // },
                // {
                //     id: 4, imgUrl: img4, detailList: [
                //         { id: 1, type: 'image', url: img4_1 },
                //         { id: 2, type: 'image', url: img4_2 },
                //         { id: 3, type: 'image', url: img4_3 },
                //         { id: 4, type: 'image', url: img4_4 },
                //         { id: 5, type: 'image', url: img4_5 },
                //         { id: 6, type: 'image', url: img4_6 },
                //         { id: 7, type: 'image', url: img4_7 },
                //         { id: 8, type: 'image', url: img4_8 },
                //         { id: 9, type: 'image', url: img4_9 }
                //     ]
                // },
                // {
                //     id: 5, imgUrl: img5, detailList: [
                //         // {id:1,type:'video',url:img5_1}
                //     ]
                // },
                // {
                //     id: 6, imgUrl: img6, detailList: [
                //         { id: 1, type: 'image', url: img6_1 },
                //         { id: 2, type: 'image', url: img6_2 },
                //         { id: 3, type: 'image', url: img6_3 },
                //         { id: 4, type: 'image', url: img6_4 },
                //         { id: 5, type: 'image', url: img6_5 },
                //         { id: 6, type: 'image', url: img6_6 }
                //     ]
                // },
                // {
                //     id: 7, imgUrl: img7, detailList: [
                //         { id: 1, type: 'image', url: img7_1 },
                //         { id: 2, type: 'image', url: img7_2 },
                //         { id: 3, type: 'image', url: img7_3 },
                //         { id: 4, type: 'image', url: img7_4 },
                //         { id: 5, type: 'image', url: img7_5 }
                //     ]
                // },
                // {
                //     id: 8, imgUrl: img8, detailList: [
                //         { id: 1, type: 'image', url: img8_1 },
                //         { id: 2, type: 'image', url: img8_2 },
                //         { id: 3, type: 'image', url: img8_3 },
                //         { id: 4, type: 'image', url: img8_4 },
                //         { id: 5, type: 'image', url: img8_5 },
                //         { id: 6, type: 'image', url: img8_6 },
                //         // {id:7,type:'video',url:img8_7}
                //     ]
                // },
                // {
                //     id: 9, imgUrl: img9, detailList: [
                //         { id: 1, type: 'image', url: img9_1 },
                //         { id: 2, type: 'image', url: img9_2 }
                //     ]
                // },
                // {
                //     id: 10, imgUrl: img10, detailList: [
                //         // {id:1,type:'video',url:img10_1}
                //     ]
                // },
                // {
                //     id: 11, imgUrl: img11, detailList: [
                //         { id: 1, type: 'image', url: img11_1 },
                //         { id: 2, type: 'image', url: img11_2 },
                //         { id: 3, type: 'image', url: img11_3 },
                //         { id: 4, type: 'image', url: img11_4 },
                //         { id: 5, type: 'image', url: img11_5 }
                //     ]
                // },
                // {
                //     id: 12, imgUrl: img12, detailList: [
                //         { id: 1, type: 'image', url: img12_1 },
                //         { id: 2, type: 'image', url: img12_2 }
                //     ]
                // },
                // {
                //     id: 13, imgUrl: img13, detailList: [
                //         { id: 1, type: 'video', url: 'http://dscj-static-file.oss-cn-qingdao.aliyuncs.com/video/201604131230058.mp4' }
                //     ]
                // },
                // {
                //     id: 14, imgUrl: img14, detailList: [
                //         { id: 1, type: 'image', url: img14_1 },
                //         { id: 2, type: 'image', url: img14_2 },
                //         // {id:3,type:'video',url:img14_3}
                //     ]
                // },
                // {
                //     id: 15, imgUrl: img15, detailList: [
                //         // {id:1,type:'video',url:img15_1}
                //     ]
                // },
                // {
                //     id: 16, imgUrl: img16, detailList: [
                //         { id: 1, type: 'image', url: img16_1 },
                //         { id: 2, type: 'image', url: img16_2 },
                //         { id: 3, type: 'image', url: img16_3 },
                //         { id: 4, type: 'image', url: img16_4 },
                //         { id: 5, type: 'image', url: img16_5 },
                //         { id: 6, type: 'image', url: img16_6 },
                //         { id: 7, type: 'image', url: img16_7 },
                //         { id: 8, type: 'image', url: img16_8 },
                //         { id: 9, type: 'image', url: img16_9 }
                //     ]
                // },
                // {
                //     id: 17, imgUrl: img17, detailList: [
                //         { id: 1, type: 'image', url: img7_1 },
                //         { id: 2, type: 'image', url: img7_2 },
                //         { id: 3, type: 'image', url: img7_3 },
                //         { id: 4, type: 'image', url: img7_4 },
                //         { id: 5, type: 'image', url: img7_5 }
                //     ]
                // },
                // {
                //     id: 18, imgUrl: img18, detailList: [
                //         { id: 1, type: 'image', url: img18_1 },
                //         { id: 2, type: 'image', url: img18_2 },
                //         { id: 3, type: 'image', url: img18_3 },
                //         { id: 4, type: 'image', url: img18_4 },
                //         { id: 5, type: 'image', url: img18_5 },
                //         // {id:6,type:'video',url:img18_6}
                //     ]
                // },
                // {
                //     id: 19, imgUrl: img19, detailList: [
                //         { id: 1, type: 'image', url: img19_1 },
                //         { id: 2, type: 'image', url: img19_2 }
                //     ]
                // },
                // {
                //     id: 20, imgUrl: img20, detailList: [
                //         // {id:1,type:'video',url:img20_1}
                //     ]
                // },
                // { id: 21, imgUrl: img21, detailList: [] }
            ],
            detailList: [],
            showDetail: false,
            carouselHeight: 0,
            carouselStyle: {}
        }
    },
    methods: {
        showDetailHandler(id) {
            for (var i = 0; i < this.dataList.length; i++) {
                if (this.dataList[i].id === id) {
                    this.detailList = this.dataList[i].detailList;
                }
            }

            if (this.detailList.length > 0) {
                this.showDetail = true;
            }
        },
        preHandler() {
            this.$refs.mySwaper.prev();
            var myVideo = document.getElementById("myVideo");
            if (myVideo)
                myVideo.pause();
        },
        nextHandler() {
            this.$refs.mySwaper.next();
            var myVideo = document.getElementById("myVideo");
            if (myVideo)
                myVideo.pause();
        },
        hideHandler() {
            this.$refs.mySwaper.setActiveItem(0);
            this.showDetail = false;
        },
        getImgWidth(item) {
            if (!this.isPhone) {
                return 'auto';
            }
            else {
                if (item.isVertical) {
                    return 'auto';
                }
                return '100%';
            }
        },
        getImgHeight(item) {
            if (!this.isPhone) {
                return '100%';
            }
            else {
                if (item.isVertical) {
                    return '100%';
                }
                return 'auto';
            }
        }
    },
    mounted() {
        console.log(window.innerWidth)
        if (!this.isPhone) {
            var carousel = Math.floor(window.innerWidth * 66.66667 / 100);
            // if(carousel % 2 === 0)
            //     carousel = Math.ceil(window.innerWidth * 66.66667 / 100);
            //     alert(carousel)
            this.carouselStyle.width = Math.floor(carousel);
            this.carouselHeight = carousel * 9 / 16;
        }
        else {
            this.carouselHeight = window.innerWidth;
        }
    },
    computed: {
        ...mapState({
            deviceType: state => state.device.device_type
        }),
        isPhone() {
            return this.deviceType === 'phone';
        }
    },
    components: {
        // 'img-item': HolyImage,
    }
}
</script>
<style lang="scss">
.holy-water-view {
    &.is-phone-view {
        .img-list {
            .holy-img {
                width: 100%;
                float: left;
            }
        }
    }
    .img-list {
        .holy-img {
            width: 33.33%; // width:100%;
            float: left;
        }
        &.blur {
            img {}
            // filter: url(blur.svg#blur);
            /* FireFox, Chrome, Opera */
            -webkit-filter: blur(10px);
            /* Chrome, Opera */
            -moz-filter: blur(10px);
            -ms-filter: blur(10px);
            filter: blur(10px);

            filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=10, MakeShadow=false);
            /* IE6~IE9 */
        }
    }
    .carousel-container {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        background-color: rgba(0, 0, 0, 0.4);
        .Row {
            // width: 100%;
            // height: 100%;
            .el-carousel {
                // left: 1%;
                // width: 102%;
                .el-carousel__item {
                    // background-color: rgba(0, 0, 0, 1);
                    // border: 1px solid transparent
                }
                .title {
                    p {
                      color:#ffffff;
                    }
                }
                .content {
                    width: 100%;
                    height: 100%;

                    img {
                        height: 100%;
                    }
                    video {
                        width: 100%;
                        height: 100%;
                        background-color: #000000;
                    }
                }
            }
            .btn {
                opacity: 0.6;
                box-sizing: border-box;
                img {
                    width: 100%;
                    display: block;
                }
                &:hover {
                    opacity: 1;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>