<template>
    <div>
        <h2 @click="toLink">{{ text }}</h2>
        <Tabs>
            <TabPane label="作业">
                <homework />
            </TabPane>
            <TabPane label="课程">
                <curriculum />
            </TabPane>
            <TabPane label="问答">
                <exchenge />
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
    import curriculum from './tabs-page/curriculum'
    import exchenge from './tabs-page/exchange'
    import homework from './tabs-page/homework'

    export default {
        components: {curriculum, exchenge, homework},
        data() {
            return {
                text: '作业列表'
            }
        },
        methods: {
            toLink() {
                this.$router.push('/dashboard/tutor-course')
            }
        },
        mounted() {
            console.log(this.$route.params);
        }
    }
</script>
