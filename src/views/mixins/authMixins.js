export default {
    methods: {
        setAuthAdmin(){
            if(localStorage.getItem('PERSONALDETAILS')){
                let d = JSON.parse(localStorage.getItem('PERSONALDETAILS'));
                if(d.role_id === 1)  return false
                else return true
            }
        }
    }
}