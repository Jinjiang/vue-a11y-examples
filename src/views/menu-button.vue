<template>
  <div>
    <!-- navigation -->
    <!-- @todo: A-Z a-z ESC -->
    <div ref="navigation">
      <VueAria
        :aria="{
          haspopup: true,
          expanded: navigation.shown,
          controls: `${localId}-navigation-menu`
        }"
      >
        <button
          :id="`${localId}-navigation-button`"
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
        :aria="{ labelledby: `${localId}-navigation-button` }"
      >
        <ul
          :id="`${localId}-navigation-menu`"
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
    <!-- activedescendant -->
    <div ref="actions">
      <VueAria
        :aria="{
          haspopup: true,
          expanded: actions.shown,
          controls: `${localId}-actions-menu`
        }"
      >
        <button
          :id="`${localId}-actions-button`"
          ref="actionsButton"
          @click="actionsToggle"
          @mouseenter="actionsHoverOn"
          @mouseleave="actionsHoverOff"
          @keydown="keyTravel"
        >
          Actions
        </button>
      </VueAria>
      Last Action: {{ actions.lastAction || "none" }}
      <VueAria
        v-if="actions.shown"
        role="menu"
        :tabindex="-1"
        :aria="{
          labelledby: `${localId}-actions-button`,
          activedescendant:
            actions.activeOptionIndex >= 0
              ? `${localId}-actions-option-${actions.activeOptionIndex}`
              : ''
        }"
      >
        <ul
          :id="`${localId}-actions-menu`"
          ref="actionsMenu"
          @keydown="keyTravel"
          @mouseenter="actionsHoverOn"
          @mouseleave="actionsHoverOff"
        >
          <VueAria
            v-for="(item, index) in actions.options"
            :key="index"
            role="menuitem"
            :aria="{ selected: index === actions.activeOptionIndex }"
          >
            <li
              :id="`${localId}-actions-option-${index}`"
              class="action"
              :class="{
                'action-selected': index === actions.activeOptionIndex
              }"
              @click="actionSelect(index);"
            >
              {{ item }}
            </li>
          </VueAria>
        </ul>
      </VueAria>
    </div>
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
const ACTIONS_OPTIONS = ["Action 1", "Action 2", "Action 3", "Action 4"];

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
      },
      actions: {
        options: ACTIONS_OPTIONS,
        hoverable: true,
        hoverTimer: 0,
        shown: false,
        activeOptionIndex: -1,
        lastAction: ""
      }
    };
  },
  methods: {
    navigationToggle() {
      this.navigation.shown = !this.navigation.shown;
      this.navigation.hoverable = !this.navigation.shown;
      clearTimeout(this.navigation.hoverTimer);
    },
    navigationHoverOn() {
      if (!this.navigation.hoverable) {
        return;
      }
      this.navigation.shown = true;
      clearTimeout(this.navigation.hoverTimer);
    },
    navigationHoverOff() {
      if (!this.navigation.hoverable) {
        return;
      }
      clearTimeout(this.navigation.hoverTimer);
      this.navigation.hoverTimer = setTimeout(() => {
        this.navigation.shown = false;
      }, 150);
    },

    actionsToggle() {
      this.actions.shown = !this.actions.shown;
      this.actions.hoverable = !this.actions.shown;
      clearTimeout(this.actions.hoverTimer);
      if (this.actions.shown) {
        setTimeout(() => {
          this.$refs.actionsMenu.focus();
        });
      } else {
        setTimeout(() => {
          this.$refs.actionsButton.focus();
        });
      }
    },
    actionsHoverOn() {
      if (!this.actions.hoverable) {
        return;
      }
      this.actions.shown = true;
      clearTimeout(this.actions.hoverTimer);
      setTimeout(() => {
        this.$refs.actionsMenu.focus();
      });
    },
    actionsHoverOff() {
      if (!this.actions.hoverable) {
        return;
      }
      clearTimeout(this.actions.hoverTimer);
      this.actions.hoverTimer = setTimeout(() => {
        this.actions.shown = false;
        this.actions.activeOptionIndex = -1;
        setTimeout(() => {
          this.$refs.actionsButton.focus();
        });
      }, 150);
    },
    actionSelect(index) {
      this.actions.lastAction = this.actions.options[index];
      this.actions.shown = false;
      this.actions.activeOptionIndex = -1;
      this.actions.hoverable = true;
      setTimeout(() => {
        this.$refs.actionsButton.focus();
      });
    },

    getKeyHostName() {
      const target = document.activeElement;
      const { navigation, actions } = this.$refs;
      if (navigation.contains(target)) {
        return "navigation";
      }
      if (actions.contains(target)) {
        return "actions";
      }
    },
    getKeyItems() {
      return this.$refs[`${this.getKeyHostName()}Items`] || [];
    },
    goNext(event) {
      const hostName = this.getKeyHostName();
      const host = this[hostName];
      if (!host) {
        return;
      }
      const { activeOptionIndex, options } = host;
      event.preventDefault();
      if (activeOptionIndex === -1) {
        host.shown = true;
        if (hostName === "actions") {
          setTimeout(() => {
            this.$refs.actionsMenu.focus();
          });
        }
      }
      if (activeOptionIndex === options.length - 1) {
        host.activeOptionIndex = 0;
      } else {
        host.activeOptionIndex++;
      }
      if (hostName === "navigation") {
        setTimeout(() => {
          const items = this.getKeyItems();
          items[host.activeOptionIndex].focus();
        });
      }
      return true;
    },
    goPrev(event) {
      const hostName = this.getKeyHostName();
      const host = this[hostName];
      if (!host) {
        return;
      }
      const { activeOptionIndex, options } = host;
      event.preventDefault();
      if (activeOptionIndex === -1) {
        host.shown = true;
        if (hostName === "actions") {
          setTimeout(() => {
            this.$refs.actionsMenu.focus();
          });
        }
      }
      if (activeOptionIndex === 0) {
        host.activeOptionIndex = options.length - 1;
      } else {
        host.activeOptionIndex--;
      }
      if (hostName === "navigation") {
        setTimeout(() => {
          const items = this.getKeyItems();
          items[host.activeOptionIndex].focus();
        });
      }
      return true;
    },
    goAction() {
      if (this.getKeyHostName() === "actions") {
        this.actionSelect(this.actions.activeOptionIndex);
        return true;
      }
    }
  }
};
</script>

<style scoped>
.action:hover {
  background-color: gray;
}
.action-selected {
  background-color: silver;
}
</style>
