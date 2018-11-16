<template>
  <div>
    <h1>Rearrangeable Listbox Example</h1>
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
            @keydown="
              bindTravel($event, 'listboxLeft'),
                bindShortcut($event, 'listboxLeft');
            "
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
          <div @keydown="bindTravel($event, 'toolbar');">
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
            @keydown="
              bindTravel($event, 'listboxRight'),
                bindShortcut($event, 'listboxRight');
            "
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
    <ol>
      <li>
        When focused on one of the two listboxs, you can use
        <kbd>ArrowUp</kbd> and <kbd>ArrowDown</kbd> to travel around.
      </li>
      <li>
        When focused on one of the 3 buttons under the left listbox, you can use
        <kbd>ArrowUp</kbd> and <kbd>ArrowDown</kbd> to travel around the button
        group.
      </li>
      <li>
        When focused on the left listbox, you can use shortcuts:
        <kbd>ArrowUp</kbd> + <kbd>Alt/Option</kbd> to move the item up,
        <kbd>ArrowDown</kbd> + <kbd>Alt/Option</kbd> to move the item down, or
        <kbd>ArrowRight</kbd> + <kbd>Alt/Option</kbd> to move the item to the
        right listbox.
      </li>
      <li>
        When focused on the right listbox, you can use shortcut:
        <kbd>ArrowLeft</kbd> + <kbd>Alt/Option</kbd> to move the item to the
        left listbox.
      </li>
      <li>Any updates will be announced politely through a screen reader.</li>
      <li>
        Related utils: <code>&lt;VueAria&gt;</code>,
        <code>&lt;VueLive&gt;</code>, <code>MixinShortcuts</code>,
        <code>MixinTravel</code>, <code>MixinId</code>.
      </li>
      <li>
        Ref: <a :href="w3cLink" target="_blank">{{ w3cLink }}</a>
      </li>
    </ol>
  </div>
</template>

<script>
import { MixinId, MixinTravel, MixinShortcuts, VueAria } from "vue-a11y-utils";

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

const travelOption = {
  listboxLeft: {
    getItems(vm) {
      return vm.$refs.leftOptions;
    },
    getIndex(vm) {
      return vm.activeLeftOptionIndex;
    },
    setIndex(vm, index) {
      vm.activeLeftOptionIndex = index;
      this.getItems(vm)[index].scrollIntoView();
    },
    move(vm, event, newIndex, oldIndex, items) {
      if (event.altKey) {
        return;
      }
      event.preventDefault();
      if (newIndex === -1 || newIndex === items.length) {
        return;
      }
      this.setIndex(vm, newIndex);
    }
  },
  listboxRight: {
    getItems(vm) {
      return vm.$refs.rightOptions;
    },
    getIndex(vm) {
      return vm.activeRightOptionIndex;
    },
    setIndex(vm, index) {
      vm.activeRightOptionIndex = index;
      this.getItems(vm)[index].scrollIntoView();
    },
    move(vm, event, newIndex, oldIndex, items) {
      if (event.altKey) {
        return;
      }
      event.preventDefault();
      if (newIndex === -1 || newIndex === items.length) {
        return;
      }
      this.setIndex(vm, newIndex);
    }
  },
  toolbar: {
    orientation: "horizontal",
    getItems(vm) {
      const refs = vm.$refs;
      return [refs.buttonUp, refs.buttonDown, refs.buttonRight];
    },
    getIndex(vm) {
      return vm.activeButtonIndex;
    },
    setIndex(vm, index) {
      vm.activeButtonIndex = index;
      this.getItems(vm)[index].focus();
    },
    move(vm, event, newIndex, oldIndex, items) {
      event.preventDefault();
      if (newIndex === -1 || newIndex === items.length) {
        return;
      }
      this.setIndex(vm, newIndex);
    }
  }
};

const shortcutsOption = {
  listboxLeft: [
    {
      key: "up",
      modifiers: { alt: true },
      handle(event) {
        return this.moveUp(event);
      }
    },
    {
      key: "down",
      modifiers: { alt: true },
      handle(event) {
        return this.moveDown(event);
      }
    },
    {
      key: "right",
      modifiers: { alt: true },
      handle(event) {
        return this.moveRight(event);
      }
    }
  ],
  listboxRight: {
    key: "left",
    modifiers: { alt: true },
    handle(event) {
      return this.moveLeft(event);
    }
  }
};

export default {
  inject: ["announce"],
  mixins: [MixinId, MixinTravel, MixinShortcuts],
  components: { VueAria },
  $travel: travelOption,
  $shortcuts: shortcutsOption,
  data() {
    return {
      orientation: "vertical",
      disabled: false,
      leftOptions: OPTIONS.slice(0),
      rightOptions: [],
      activeLeftOptionIndex: -1,
      activeRightOptionIndex: -1,
      activeButtonIndex: 0,
      w3cLink:
        "https://w3c.github.io/aria-practices/examples/listbox/listbox-rearrangeable.html"
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
      travelOption.listboxLeft
        .getItems(this)
        [this.activeLeftOptionIndex].scrollIntoView();
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
      travelOption.listboxLeft
        .getItems(this)
        [this.activeLeftOptionIndex].scrollIntoView();
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
.content > * + * {
  margin-left: 1em;
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
