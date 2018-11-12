<template>
  <div>
    <VueAria
      role="button"
      :tabindex="0"
      :aria="{
        expanded,
        controls: `${localId}-panel`
      }"
    >
      <div
        :id="`${localId}-tab`"
        ref="tab"
        class="accordion-tab"
        @click="$emit('trigger');"
        @keydown.space="$emit('trigger');"
        @keydown.enter="$emit('trigger');"
      >
        {{ title }}
        <span
          class="icon"
          :class="expanded ? 'icon-expanded' : 'icon-collapsed'"
        ></span>
      </div>
    </VueAria>
    <VueAria
      role="region"
      :aria="{
        labelledby: `${localId}-tab`
      }"
    >
      <div :id="`${localId}-panel`" class="accordion-panel" v-show="expanded">
        <slot />
      </div>
    </VueAria>
  </div>
</template>

<script>
import { VueAria, MixinId } from "vue-a11y-utils";
export default {
  mixins: [MixinId],
  components: { VueAria },
  props: { title: String, expanded: Boolean },
  methods: {
    focus() {
      this.$refs.tab.focus();
    }
  }
};
</script>

<style>
.accordion-tab {
  background-color: silver;
  padding: 0.25em 0.5em;
}
.accordion-tab:focus {
  outline: 2px blue solid;
}
.icon {
  float: right;
  width: 1em;
  text-align: center;
}
.icon-expanded::before {
  content: "-";
}
.icon-collapsed::before {
  content: "+";
}
.accordion-panel {
  padding: 0.25em 0.5em;
}
</style>
