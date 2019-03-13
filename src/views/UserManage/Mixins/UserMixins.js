import postData from 'src/api/postData'
export default {
    methods: {
        fromAddAndEdit(url,d){
            postData(url, d).then((res) => {
                console.log(res.data,'ss')
                if(res){
                    this.getList()
                }
          })
        }
    },
}