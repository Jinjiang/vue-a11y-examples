<template>
  <VueAria role="menu" :aria="{ label: text }">
    <ul @keydown="keyTravel($event), bindShortcut($event, 'menu');">
      <template v-for="(item, index) in items">
        <li v-if="item.type !== 'separator'" :key="index" role="none">
          <VueAria
            role="menuitem"
            :aria="{
              haspopup: !!item.items,
              expanded: expandedItemIndex === index
            }"
            :tabindex="activeItemIndex === index ? 0 : -1"
          >
            <a href="#" ref="items" @click="action($event, item);">{{
              item.text
            }}</a>
          </VueAria>
          <VueMenu
            v-if="item.items && expandedItemIndex === index"
            :text="item.text"
            :items="item.items"
            @action="$emit('action', $event);"
            @collapse="collapse"
          />
        </li>
        <li v-else role="separator" :key="index"></li>
      </template>
    </ul>
  </VueAria>
</template>

<script>
import { VueAria, MixinKeyTravel, MixinKeyShortcuts } from "vue-a11y-utils";
export default {
  name: "VueMenu",
  mixins: [MixinKeyTravel, MixinKeyShortcuts],
  components: { VueAria },
  shortcuts: {
    menu: [
      {
        key: "left",
        handle(event) {
          event.preventDefault();
          this.$emit("collapse");
          this.activeItemIndex = -1;
          this.expandedItemIndex = -1;
          return true;
        }
      },
      {
        key: "right",
        handle(event) {
          const { activeItemIndex } = this;
          const item = this.items[activeItemIndex];
          if (item && item.items) {
            event.preventDefault();
            this.expandedItemIndex = this.activeItemIndex;
            this.activeItemIndex = -1;
            return true;
          }
        }
      }
    ]
  },
  props: {
    text: String,
    items: Array // { text, value, type, checked, items[] }
  },
  data() {
    return {
      orientation: "vertical",
      activeItemIndex: 0,
      expandedItemIndex: -1,
      autofocus: true
    };
  },
  methods: {
    getKeyItems() {
      return this.$refs.items;
    },
    getAutofocusItem() {
      return this.getKeyItems()[0];
    },
    goNext(event) {
      const { activeItemIndex } = this;
      const items = this.getKeyItems();
      const length = items.length;
      if (length <= 1 || activeItemIndex < 0) {
        return;
      }
      event.preventDefault();
      if (activeItemIndex >= length - 1) {
        this.activeItemIndex = 0;
      } else {
        this.activeItemIndex++;
      }
      items[this.activeItemIndex].focus();
      return true;
    },
    goPrev(event) {
      const { activeItemIndex } = this;
      const items = this.getKeyItems();
      const length = items.length;
      if (length <= 1 || activeItemIndex < 0) {
        return;
      }
      event.preventDefault();
      if (activeItemIndex === 0) {
        this.activeItemIndex = length - 1;
      } else {
        this.activeItemIndex--;
      }
      items[this.activeItemIndex].focus();
      return true;
    },
    fireAction(item, event) {
      const { activeItemIndex } = this;
      if (activeItemIndex < 0) {
        return;
      }
      if (this.items[activeItemIndex].items) {
        return;
      }
      event.preventDefault();
      this.$emit("action", this.items[activeItemIndex].value);
    },
    action(event, item) {
      event.preventDefault();
      if (item.items) {
        this.expandedItemIndex = this.activeItemIndex;
        this.activeItemIndex = -1;
      } else {
        this.$emit("action", item.value);
      }
    },
    collapse() {
      this.activeItemIndex = this.expandedItemIndex;
      this.expandedItemIndex = -1;
      const items = this.getKeyItems();
      items[this.activeItemIndex].focus();
    }
  }
};
</script>

<style></style>
