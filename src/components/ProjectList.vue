<template>
    <div class='project-panel'>
      <h1>项目管理系统</h1>
      <p>欢迎来到点师成金后台，赶快选择一个项目进行管理吧！</p>
      <div class='project-list'>
          <Card class='project-item' v-for='(item, index) in projectList' :key="item.id">
              <div @click='changeSelectProject(item.id)'>
                  <h3>{{item.name}}<span>{{index | Numfilter}}</span></h3>
              </div>
              <Divider />
          </Card>
      </div>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { Config } from "../config/base";
import { doTimeFormat } from "../components/Util";
export default {
  computed: {
    ...mapState({ projectList: state => state.project.project_list, isLoading: state => state.project.isLoading })
  },
  filters: {
    Numfilter(v) {
      var _v = v + 1;
      return _v > 10 ? _v : "0" + _v;
    }
  },
  methods: {
    ...mapActions([ "get_project_list", "change_selected_project_id", "clear_store" ]),
    changeSelectProject(id) {
      var oldId = this.$localStorage.get("lastSelectedProject");
      this.change_selected_project_id(id);
      if (oldId != id) {
        this.$localStorage.set("lastSelectedProject", id);
        this.clear_store();
      }
      this.$router.replace({ path: "/dashboard" });
    },
    getCreateTime(time) {
      return doTimeFormat(time);
    }
  },
  watch: {
    isLoading(val) {
      this.$config.IsLoading(val);
    }
  },
  mounted() {
    this.get_project_list();
  }
};
</script>

<style lang="scss">
.project-panel {
  width: 100%;
  height: 100vh;
  background: #f9f9f9;
  h1 {
    margin-top: 0;
    font-size: 48px;
    color: #333333;
    letter-spacing: 0;
    margin-bottom: 0;
    padding-top: 60.2px;
  }
  h1 + p {
    font-size: 16px;
    color: #333333;
    letter-spacing: 0;
  }
  .project-list {
    text-align: left;
    padding: 20px;
    .project-item {
      cursor: pointer;
      display: inline-block;
      width: 350px;
      height: 180px;
      margin: 20px;
      border: 0;
      border-top: 5px solid #3DAAFF;
      background: #ffffff;
      box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      .xght-webfont-tag {
        &:before {
          color: #3DAAFF;
        }
      }
      h3 {
        margin-top: 60px;
        position: relative;
        span {
          opacity: 0.1;
          font-size: 100px;
          color: #3DAAFF;
          letter-spacing: 0;
          position: absolute;
          right: 0;
          bottom: -20px;
        }
      }
      h3,
      p {
        text-align: left;
      }
      p {
        border-top: 1px solid #e5e5e5;
        padding-top: 18px;
      }
    }
  }
}
</style>