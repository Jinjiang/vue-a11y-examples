<template>
  <VueAria role="menu" :aria="{ label: text }">
    <ul @keydown="travel($event), bindShortcut($event, 'menu');">
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
import { VueAria, MixinTravel, MixinShortcuts } from "vue-a11y-utils";

const travel = {
  getItems(vm) {
    return vm.getItems();
  },
  getIndex(vm) {
    return vm.activeItemIndex;
  },
  setIndex(vm, index) {
    vm.activeItemIndex = index;
    this.getItems(vm)[index].focus();
  },
  move(vm, event, newIndex, oldIndex, items) {
    event.preventDefault();
    let nextIndex = newIndex;
    if (newIndex === -1) {
      nextIndex = items.length - 1;
    } else if (newIndex === items.length) {
      nextIndex = 0;
    }
    this.setIndex(vm, nextIndex);
    return true;
  }
};

const shortcuts = [
  {
    key: "left",
    handle(event) {
      if (this.activeItemIndex >= 0) {
        event.preventDefault();
        this.$emit("collapse");
        this.activeItemIndex = -1;
        this.expandedItemIndex = -1;
        return true;
      }
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
];

export default {
  name: "VueMenu",
  mixins: [MixinTravel, MixinShortcuts],
  components: { VueAria },
  travel,
  shortcuts,
  props: {
    text: String,
    items: Array // { text, value, type, checked, items[] }
  },
  data() {
    return {
      activeItemIndex: 0,
      expandedItemIndex: -1
    };
  },
  mounted() {
    this.getItems()[0].focus();
  },
  methods: {
    getItems() {
      return this.$refs.items;
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
      const items = this.getItems();
      items[this.activeItemIndex].focus();
    }
  }
};
</script>
