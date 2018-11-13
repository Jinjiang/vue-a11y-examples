<template>
  <div>
    <!-- navigation -->
    <div ref="navigation">
      <VueAria :aria="{ haspopup: true, controls: `${localId}-navigation` }">
        <button
          :id="`${localId}-button-navigation`"
          @click="navigationToggle"
          @mouseenter="navigationHoverOn"
          @mouseleave="navigationHoverOff"
          @keydown="keyTravel"
        >
          WAI-ARIA Quick Links
        </button>
      </VueAria>
      <VueAria
        v-if="navigation.shown"
        role="menu"
        :aria="{ labelledby: `${localId}-button-navigation` }"
      >
        <ul
          :id="`${localId}-navigation`"
          @keydown="keyTravel"
          @mouseenter="navigationHoverOn"
          @mouseleave="navigationHoverOff"
        >
          <li
            role="none"
            v-for="(item, index) in navigation.options"
            :key="index"
          >
            <a
              role="menuitem"
              ref="navigationItems"
              tabindex="-1"
              :href="item.link"
              >{{ item.text }}</a
            >
          </li>
        </ul>
      </VueAria>
    </div>
    <!-- focus -->
    <!-- activedescendant -->
  </div>
</template>

<script>
import { VueAria, MixinKeyTravel, MixinId } from "vue-a11y-utils";

const NAV_OPTIONS = [
  { text: "W3C Home Page", link: "https://www.w3.org/" },
  {
    text: "W3C Web Accessibility Initiative",
    link: "https://www.w3.org/standards/webdesign/accessibility"
  },
  {
    text: "Accessible Rich Internet Application Specification",
    link: "https://www.w3.org/TR/wai-aria/"
  },
  {
    text: "WAI-ARIA Authoring Practices",
    link: "https://www.w3.org/TR/wai-aria-practices/"
  },
  {
    text: "WAI-ARIA Implementation Guide",
    link: "https://www.w3.org/TR/wai-aria-implementation/"
  },
  {
    text: "Accessible Name and Description",
    link: "https://www.w3.org/TR/accname-aam-1.1/"
  }
];

export default {
  mixins: [MixinKeyTravel, MixinId],
  components: { VueAria },
  data() {
    return {
      navigation: {
        options: NAV_OPTIONS,
        hoverable: true,
        hoverTimer: 0,
        shown: false,
        activeOptionIndex: -1
      }
    };
  },
  methods: {
    navigationToggle() {
      this.navigation.shown = !this.navigation.shown;
      this.navigation.hoverable = !this.navigation.shown;
    },
    navigationHoverOn() {
      this.navigation.shown = true;
      clearTimeout(this.navigation.hoverTimer);
    },
    navigationHoverOff() {
      clearTimeout(this.navigation.hoverTimer);
      this.navigation.hoverTimer = setTimeout(() => {
        this.navigation.shown = false;
      }, 150);
    },
    getKeyItems() {
      return this.$refs.navigationItems;
    },
    goNext(event) {
      const { navigation } = this;
      const { activeOptionIndex, options } = navigation;
      event.preventDefault();
      if (activeOptionIndex === -1) {
        navigation.shown = true;
      }
      if (activeOptionIndex === options.length - 1) {
        navigation.activeOptionIndex = 0;
      } else {
        navigation.activeOptionIndex++;
      }
      setTimeout(() => {
        const items = this.getKeyItems();
        items[navigation.activeOptionIndex].focus();
      });
      return true;
    },
    goPrev(event) {
      const { navigation } = this;
      const { activeOptionIndex, options } = navigation;
      event.preventDefault();
      if (activeOptionIndex === -1) {
        navigation.shown = true;
      }
      if (activeOptionIndex === 0) {
        navigation.activeOptionIndex = options.length - 1;
      } else {
        navigation.activeOptionIndex--;
      }
      setTimeout(() => {
        const items = this.getKeyItems();
        items[navigation.activeOptionIndex].focus();
      });
      return true;
    },
    fireAction() {}
  }
};
</script>
