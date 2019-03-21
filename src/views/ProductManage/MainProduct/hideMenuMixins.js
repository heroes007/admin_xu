export default {
    data(){
        return{
            menushow: true,
            hideIcon: 'ios-arrow-back',
            viewStyl: 'width: calc(100% - 260px)'
        }
    },
    methods: {
        hideMenu(){
            this.menushow = !this.menushow
            this.$nextTick(() => {
                this.hideIcon = this.menushow ? 'ios-arrow-back' : 'ios-arrow-forward'
                this.viewStyl = this.menushow ? 'width: calc(100% - 260px)' : 'width: calc(100% - 60px)'
                document.title = '九划医疗后台管理'
            })
        }
    },
    mounted(){
        document.title = '九划医疗后台管理'
    }
  }
