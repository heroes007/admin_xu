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
                // livePost('/create',{})
            }
        }
    }
</script>

<style scoped>

</style>