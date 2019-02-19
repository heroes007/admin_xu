/**
* Created by lesonli on 2016/11/16.
*/
<template>
    <p>{{subjectName}}</p>
</template>
<style lang="scss">

</style>
<script>
    export default{
        data(){
            return{

            }
        },
        props:{
            sid:{
                type:Number,
                required:true
            }
        },
        computed:{
            subjectName() {
                if(this.$store.state.subject.subject_list.length > 0){
                    for(var i=0;i<this.$store.state.subject.subject_list.length;i++){
                        if(this.$store.state.subject.subject_list[i].id === this.sid){
                            return this.$store.state.subject.subject_list[i].name;
                        }
                    }
                    return '未找到';
                }else return this.$store.state.subject.msg;
            }
        },
        mounted(){
//            if(this.$store.state.subject.subject_list.length === 0)
//                this.$store.dispatch('get_subject_list');
        },
    }
</script>
