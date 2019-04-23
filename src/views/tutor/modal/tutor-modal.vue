<template>
    <Modal v-model="isShow" :title="title" :mask-closable="false" :footer-hide="true" @on-cancel="closeModal">

    </Modal>
</template>

<script>
    export default {
        data() {
            return {
                isShow: false
            }
        },
        props: {
            show: {
                type: Boolean,
                required: false
            },
            title: {
                type: String,
            }
        },
        methods: {
            closeModal(val) {
                this.$emit('close-modal', val)
            }
        },
        watch: {
            show(val) {
                this.isShow = val
            }
        }
    }
</script>

<style scoped>

</style>
