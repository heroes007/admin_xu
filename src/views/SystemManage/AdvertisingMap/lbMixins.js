
import lb from '../lb/ManageLb'
export default {
    data(){
        return{
            show: false
        }
    },
    components: { lb }, 
    methods:{
        lb(){
            this.show = true
        },
        close(){
            this.show = false
        }
    }
}