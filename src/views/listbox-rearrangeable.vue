<template>
  <div>
    <p>
      Rank features important to you when choosing where to live. If a feature
      is unimportant, move it to the unimportant features list.
    </p>
    <div class="content">
      <div>
        <span :id="`${localId}-left-label`">Important Features:</span>
        <VueAria role="listbox" :tabindex="0" :aria="aria.leftListbox">
          <ul
            ref="leftListbox"
            class="listbox"
            @keydown="keyTravel($event), bindShortcut($event, 'listboxLeft');"
          >
            <VueAria
              v-for="(text, index) in leftOptions"
              :key="index"
              role="option"
              :aria="{ selected: activeLeftOptionIndex === index }"
            >
              <li
                ref="leftOptions"
                :class="{ 'option-selected': activeLeftOptionIndex === index }"
                @click="activeLeftOptionIndex = index;"
              >
                {{ text }}
              </li>
            </VueAria>
          </ul>
        </VueAria>
        <VueAria role="toolbar" :aria="{ label: 'Actions' }">
          <div @keydown="bindShortcut($event, 'toolbarLeft');">
            <VueAria
              :aria="aria.buttonUp"
              :tabindex="activeButtonIndex === 0 ? 0 : -1"
            >
              <button ref="buttonUp" @click="moveUp">Up</button>
            </VueAria>
            <VueAria
              :aria="aria.buttonDown"
              :tabindex="activeButtonIndex === 1 ? 0 : -1"
            >
              <button ref="buttonDown" @click="moveDown">Down</button>
            </VueAria>
            <VueAria
              :aria="aria.buttonRight"
              :tabindex="activeButtonIndex === 2 ? 0 : -1"
            >
              <button ref="buttonRight" @click="moveRight">
                Not Important
              </button>
            </VueAria>
          </div>
        </VueAria>
      </div>
      <div>
        <span :id="`${localId}-right-label`">Unimportant Features:</span>
        <VueAria role="listbox" :tabindex="0" :aria="aria.rightListbox">
          <ul
            ref="rightListbox"
            class="listbox"
            @keydown="keyTravel($event), bindShortcut($event, 'listboxRight');"
          >
            <VueAria
              v-for="(text, index) in rightOptions"
              :key="index"
              role="option"
              :aria="{ selected: activeRightOptionIndex === index }"
            >
              <li
                ref="rightOptions"
                :class="{ 'option-selected': activeRightOptionIndex === index }"
                @click="activeRightOptionIndex = index;"
              >
                {{ text }}
              </li>
            </VueAria>
          </ul>
        </VueAria>
        <VueAria :aria="aria.buttonLeft">
          <button @click="moveLeft">Important</button>
        </VueAria>
      </div>
    </div>
  </div>
</template>

<script>
import {
  MixinId,
  MixinKeyTravel,
  MixinKeyShortcuts,
  VueAria
} from "vue-a11y-utils";
const OPTIONS = [
  "Proximity of public K-12 schools",
  "Proximity of child-friendly parks",
  "Proximity of grocery shopping",
  "Proximity of fast food",
  "Proximity of fine dining",
  "Neighborhood walkability",
  "Availability of public transit",
  "Proximity of hospital and medical services",
  "Level of traffic noise",
  "Access to major highways"
];
export default {
  inject: ["announce"],
  mixins: [MixinId, MixinKeyTravel, MixinKeyShortcuts],
  components: { VueAria },
  shortcuts: {
    listboxLeft: {
      key: "right",
      modifiers: { alt: true },
      handle(event) {
        return this.moveRight(event);
      }
    },
    listboxRight: {
      key: "left",
      modifiers: { alt: true },
      handle(event) {
        return this.moveLeft(event);
      }
    },
    toolbarLeft: [
      {
        key: "left",
        handle(event) {
          event.preventDefault();
          if (this.activeButtonIndex <= 0) {
            return;
          }
          this.activeButtonIndex--;
          const buttons = [
            this.$refs.buttonUp,
            this.$refs.buttonDown,
            this.$refs.buttonRight
          ];
          buttons[this.activeButtonIndex].focus();
        }
      },
      {
        key: "right",
        handle(event) {
          event.preventDefault();
          if (this.activeButtonIndex >= 2) {
            return;
          }
          this.activeButtonIndex++;
          const buttons = [
            this.$refs.buttonUp,
            this.$refs.buttonDown,
            this.$refs.buttonRight
          ];
          buttons[this.activeButtonIndex].focus();
        }
      }
    ]
  },
  data() {
    return {
      orientation: "vertical",
      disabled: false,
      leftOptions: OPTIONS.slice(0),
      rightOptions: [],
      activeLeftOptionIndex: -1,
      activeRightOptionIndex: -1,
      activeButtonIndex: 0
    };
  },
  computed: {
    aria() {
      const {
        localId,
        leftOptions,
        activeLeftOptionIndex,
        activeRightOptionIndex,
        activeButtonIndex
      } = this;
      return {
        leftListbox: { labelledby: `${localId}-left-label` },
        rightListbox: { labelledby: `${localId}-right-label` },
        buttonUp: {
          disabled: activeLeftOptionIndex < 1,
          selected: activeButtonIndex === 0,
          keyshortcuts: "Alt+ArrowUp"
        },
        buttonDown: {
          disabled:
            activeLeftOptionIndex === -1 ||
            activeLeftOptionIndex >= leftOptions.length - 1,
          selected: activeButtonIndex === 1,
          keyshortcuts: "Alt+ArrowDown"
        },
        buttonRight: {
          disabled: activeLeftOptionIndex < 0,
          selected: activeButtonIndex === 2,
          keyshortcuts: "Alt+ArrowRight Delte"
        },
        buttonLeft: {
          disabled: activeRightOptionIndex < 0,
          keyshortcuts: "Alt+ArrowLeft Enter"
        }
      };
    }
  },
  methods: {
    getActiveSide() {
      const target = document.activeElement;
      if (target === this.$refs.leftListbox) {
        return "left";
      } else if (target === this.$refs.rightListbox) {
        return "right";
      }
      return "";
    },
    getKeyItems() {
      const side = this.getActiveSide();
      if (side === "left") {
        return this.$refs.leftOptions;
      } else if (side === "right") {
        return this.$refs.rightOptions;
      }
      return [];
    },
    goNext(event) {
      const side = this.getActiveSide();
      const options = this.getKeyItems();
      const length = options.length;
      if (!side || !length) {
        return;
      }
      if (side === "left" && event.altKey) {
        return this.moveDown(event);
      }
      const activeOptionIndexName =
        side === "left" ? "activeLeftOptionIndex" : "activeRightOptionIndex";
      const activeOptionIndex = this[activeOptionIndexName];
      if (activeOptionIndex < 0 || activeOptionIndex === length - 1) {
        this[activeOptionIndexName] = 0;
      } else {
        this[activeOptionIndexName]++;
      }
      options[this[activeOptionIndexName]].scrollIntoView();
      return true;
    },
    goPrev(event) {
      const side = this.getActiveSide();
      const options = this.getKeyItems();
      const length = options.length;
      if (!side || !length) {
        return;
      }
      if (side === "left" && event.altKey) {
        return this.moveUp(event);
      }
      const activeOptionIndexName =
        side === "left" ? "activeLeftOptionIndex" : "activeRightOptionIndex";
      const activeOptionIndex = this[activeOptionIndexName];
      if (activeOptionIndex <= 0) {
        this[activeOptionIndexName] = length - 1;
      } else {
        this[activeOptionIndexName]--;
      }
      options[this[activeOptionIndexName]].scrollIntoView();
      return true;
    },
    fireAction() {},
    moveUp(event) {
      // validation
      if (this.activeLeftOptionIndex <= 0 || this.leftOptions.length <= 1) {
        return;
      }
      event.preventDefault();

      // change the left array
      const currentOption = this.leftOptions[this.activeLeftOptionIndex];
      const upOption = this.leftOptions[this.activeLeftOptionIndex - 1];
      this.leftOptions.splice(
        this.activeLeftOptionIndex - 1,
        2,
        currentOption,
        upOption
      );

      // change the activeLeftOptionIndex
      this.activeLeftOptionIndex--;
      this.announce(
        `Moved to position ${this.activeLeftOptionIndex}`,
        false,
        true
      );

      return true;
    },
    moveDown(event) {
      // validation
      if (
        this.activeLeftOptionIndex < 0 ||
        this.activeLeftOptionIndex >= this.leftOptions.length - 1
      ) {
        return;
      }
      event.preventDefault();

      // change the left array
      const currentOption = this.leftOptions[this.activeLeftOptionIndex];
      const downOption = this.leftOptions[this.activeLeftOptionIndex + 1];
      this.leftOptions.splice(
        this.activeLeftOptionIndex,
        2,
        downOption,
        currentOption
      );

      // change the activeLeftOptionIndex
      this.activeLeftOptionIndex++;
      this.announce(
        `Moved to position ${this.activeLeftOptionIndex}`,
        false,
        true
      );

      return true;
    },
    moveLeft(event) {
      // validation
      if (this.activeRightOptionIndex < 0) {
        return;
      }
      event.preventDefault();

      // remove it from the right array
      const currentOption = this.rightOptions[this.activeRightOptionIndex];
      this.rightOptions.splice(this.activeRightOptionIndex, 1);

      // push it to the left array
      this.leftOptions.push(currentOption);

      // change the activeRightOptionIndex
      if (this.activeRightOptionIndex > this.rightOptions.length - 1) {
        this.activeRightOptionIndex = -1;
      }
      this.announce(
        `Moved ${currentOption} to important features`,
        false,
        true
      );

      return true;
    },
    moveRight(event) {
      // validation
      if (this.activeLeftOptionIndex < 0) {
        return;
      }
      event.preventDefault();

      // remove it from the left array
      const currentOption = this.leftOptions[this.activeLeftOptionIndex];
      this.leftOptions.splice(this.activeLeftOptionIndex, 1);

      // push it to the right array
      this.rightOptions.push(currentOption);

      // change the activeLeftOptionIndex
      if (this.activeLeftOptionIndex > this.leftOptions.length - 1) {
        this.activeLeftOptionIndex = -1;
      }
      this.announce(
        `Moved ${currentOption} to unimportant features`,
        false,
        true
      );

      return true;
    }
  }
};
</script>

<style scoped>
.content {
  display: flex;
}
.content > * {
  flex: 1;
}
.content button[aria-disabled="true"] {
  color: silver;
}
.listbox {
  height: 18em;
  overflow-y: auto;
  padding: 0;
  margin: 0;
  list-style: none;
  background-color: silver;
}
.listbox > li {
  padding: 0.25em 0.5em;
}
.listbox > li.option-selected {
  background-color: gray;
}
</style>
