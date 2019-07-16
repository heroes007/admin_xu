<template>
    <div style="background-color:#f0f0f7;padding: 20px 30px;">
        <div style="display: flex;justify-content: space-between;align-items: center;background-color:#fff;height: 160px;">
            <div style="display: flex;margin-left: 50px;">
                <img src="../../assets/img/grade_all.jpg" alt="" style="height: 100px;width: 100px;border-radius: 100%">
                <div>
                    <div>name</div>
                    <div>111</div>
                </div>
            </div>
            <div></div>
        </div>
    </div
</template>

<script>
    export default {
        mounted() {
            console.log(this.$route.query)
        }
    }
</script>

<style scoped>

</style>