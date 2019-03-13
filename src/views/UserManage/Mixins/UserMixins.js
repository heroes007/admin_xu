import postData from 'src/api/postData'
export default {
    methods: {
        fromAddAndEdit(url,d){
            postData(url, d).then((res) => {
              if(res.res_code == 1){
                    this.getList()
                }
          })
        },
        formGetData(url, data) {
            postData(url, data).then((res) => {
                console.log(res.data)
            })
        }
    },
}
