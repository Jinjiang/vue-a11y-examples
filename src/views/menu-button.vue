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
          @keydown="travel($event, 'navigation');"
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
          @keydown="travel($event, 'navigation');"
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
          @keydown="travel($event, 'actions');"
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
          @keydown="travel($event, 'actions');"
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
import { VueAria, MixinTravel, MixinId } from "vue-a11y-utils";

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

const travel = {
  navigation: {
    getItems(vm) {
      return vm.navigation.options;
    },
    getIndex(vm) {
      return vm.navigation.activeOptionIndex;
    },
    setIndex(vm, index) {
      vm.navigation.activeOptionIndex = index;
      setTimeout(() => {
        vm.$refs.navigationItems[index].focus();
      });
    },
    move(vm, event, newIndex, oldIndex, items) {
      event.preventDefault();
      if (oldIndex === -1) {
        vm.navigation.shown = true;
      }
      let nextIndex = newIndex;
      if (newIndex === -1) {
        nextIndex = items.length - 1;
      } else if (newIndex === items.length) {
        nextIndex = 0;
      }
      this.setIndex(vm, nextIndex);
    }
  },
  actions: {
    getItems(vm) {
      return vm.actions.options;
    },
    getIndex(vm) {
      return vm.actions.activeOptionIndex;
    },
    setIndex(vm, index) {
      vm.actions.activeOptionIndex = index;
    },
    move(vm, event, newIndex, oldIndex, items) {
      event.preventDefault();
      if (oldIndex === -1) {
        vm.actions.shown = true;
        setTimeout(() => {
          vm.$refs.actionsMenu.focus();
        });
      }
      let nextIndex = newIndex;
      if (newIndex === -1) {
        nextIndex = items.length - 1;
      } else if (newIndex === items.length) {
        nextIndex = 0;
      }
      this.setIndex(vm, nextIndex);
    },
    action(vm, event, index) {
      if (index >= 0) {
        event.preventDefault();
        vm.actionSelect(index);
      }
    }
  }
};

export default {
  mixins: [MixinTravel, MixinId],
  components: { VueAria },
  travel,
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
        }, 50); // set 50 ms to fix the error in Safari
      } else {
        this.$refs.actionsButton.focus();
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
