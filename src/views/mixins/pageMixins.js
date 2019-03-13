export default {
  data() {
    return {
      current: 1,
      total: null,
      pageSize: 12
    }
  },
  methods: {
    pageList(val) {
      this.current = val
      this.getList()
    }
  }
}
