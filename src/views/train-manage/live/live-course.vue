<template>
    <div>
        <div>直播课</div>
        <Button type="primary" @click="add">创建</Button>
    </div>
</template>

<script>
    import livePost from '../../../api/live/postData'

    export default {
        methods: {
            add() {
                let data = {
                    subject: '这是一个标题',
                    desc: '这是一个介绍',
                    layout: 1,
                    type: 0

                }
                livePost('/create',data).then(res => {
                    console.log(res, 'res');
                })
            }
        }
    }
</script>

<style scoped>

</style>