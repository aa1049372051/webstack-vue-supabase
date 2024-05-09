<template>
  <div>
    <h4 class="text-gray">
      <i class="linecons-tag" :id="transName(item)"></i>{{ transName(item) }}
    </h4>
    <div class="row">
      <div class="col-sm-3" v-for="(web, idx) in item.site" :key="idx">
        <div
          class="xe-widget xe-conversations box2 label-info"
          title=""
          @click="openweb(web.url)"
          data-toggle="tooltip"
          data-placement="bottom"
          :data-original-title="web.url"
        >
          <div class="xe-comment-entry">
            <a class="xe-user-img">
              <img :src="getLogo(web)" class="lozad img-circle" width="40" />
            </a>
            <div class="xe-comment">
              <a href="#" class="xe-user-name overflowClip_1">
                <strong>{{ web.title }}</strong>
              </a>
              <p class="overflowClip_2">{{ web.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br />
  </div>
</template>

<script>
import { getFileUrl } from "../utils/supabase.js";
export default {
  name: "WebItem",
  props: {
    item: Object,
    transName: Function,
  },
  methods: {
    openweb(url) {
      window.open(url, "_blank");
    },
    getLogo(data) {
      let logo = data.logo;
      if (data.logotype == 2) {
        return getFileUrl(logo);
      }
      return logo;
    },
  },
};
</script>

<style scoped>
i {
  margin-right: 7px;
}
</style>
