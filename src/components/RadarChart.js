/**
 * Created by zhaiyunzhi on 2017/1/20.
 */
import { Radar } from 'vue-chartjs'
import Vue from 'vue'

//Vue.use(Radar);

export default Radar.extend({
    props:["data","options"],
    mounted () {
        this.renderChart(this.data, this.options);
    }
})