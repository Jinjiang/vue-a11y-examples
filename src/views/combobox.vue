<template>
  <div>
    <h1>Combobox Example</h1>
    <div>
      <label :id="`${localId}-label`" :for="`${localId}-input`">
        Choice a Fruit or Vegetable
      </label>
      <div class="combobox-wrapper">
        <div
          :id="`${localId}-combobox`"
          class="combobox"
          role="combobox"
          v-aria="aria.combobox"
        >
          <input
            ref="input"
            :id="`${localId}-input`"
            class="input"
            v-aria="aria.input"
            v-model="value"
            @focus="focus"
            @blur="blur"
            @keydown="bindTravel"
          />
        </div>
        <ul
          v-if="focused && list.length"
          :id="`${localId}-listbox`"
          ref="listbox"
          class="listbox"
          role="listbox"
          v-aria="aria.listbox"
        >
          <li
            v-for="(veggie, index) in list"
            :key="index"
            role="option"
            tabindex="-1"
            :id="`${localId}-option-${index}`"
            :class="{ selected: index === activeOptionIndex }"
            v-aria="{ selected: index === activeOptionIndex }"
            @mousedown="choose(veggie);"
          >
            {{ veggie }}
          </li>
        </ul>
      </div>
    </div>
    <ol>
      <li>
        When type any letter(s) in the textbox, a matched words list will be
        poped up below.
      </li>
      <li>
        You can travel all the words listed below by <kbd>ArrowUp</kbd> and
        <kbd>ArrowDown</kbd>.
      </li>
      <li>
        You can also press <kbd>ENTER</kbd> key to choose the current word you
        traveled to.
      </li>
      <li>
        Related utils: <code>v-aria</code> directive, <code>MixinTravel</code>,
        <code>MixinId</code>.
      </li>
      <li>
        Ref: <a :href="w3cLink" target="_blank">{{ w3cLink }}</a>
      </li>
    </ol>
  </div>
</template>

<script>
import { MixinId, MixinTravel, directiveAria } from "vue-a11y-utils";

const travelOption = {
  getItems(vm) {
    return vm.list;
  },
  getIndex(vm) {
    return vm.activeOptionIndex;
  },
  setIndex(vm, index) {
    vm.activeOptionIndex = index;
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
  },
  enter(vm, event, index, items) {
    event.preventDefault();
    const value = items[index];
    if (value) {
      vm.value = value;
    }
  }
};

// https://w3c.github.io/aria-practices/examples/combobox/aria1.1pattern/js/listbox-combo-example.js
const FRUITS_AND_VEGGIES = [
  "Apple",
  "Artichoke",
  "Asparagus",
  "Banana",
  "Beets",
  "Bell pepper",
  "Broccoli",
  "Brussels sprout",
  "Cabbage",
  "Carrot",
  "Cauliflower",
  "Celery",
  "Chard",
  "Chicory",
  "Corn",
  "Cucumber",
  "Daikon",
  "Date",
  "Edamame",
  "Eggplant",
  "Elderberry",
  "Fennel",
  "Fig",
  "Garlic",
  "Grape",
  "Honeydew melon",
  "Iceberg lettuce",
  "Jerusalem artichoke",
  "Kale",
  "Kiwi",
  "Leek",
  "Lemon",
  "Mango",
  "Mangosteen",
  "Melon",
  "Mushroom",
  "Nectarine",
  "Okra",
  "Olive",
  "Onion",
  "Orange",
  "Parship",
  "Pea",
  "Pear",
  "Pineapple",
  "Potato",
  "Pumpkin",
  "Quince",
  "Radish",
  "Rhubarb",
  "Shallot",
  "Spinach",
  "Squash",
  "Strawberry",
  "Sweet potato",
  "Tomato",
  "Turnip",
  "Ugli fruit",
  "Victoria plum",
  "Watercress",
  "Watermelon",
  "Yam",
  "Zucchini"
];

export default {
  mixins: [MixinId, MixinTravel],
  directives: { aria: directiveAria },
  $travel: travelOption,
  data() {
    return {
      expanded: false,
      activeOptionIndex: -1,
      value: "",
      focused: false,
      focusTimer: 0,
      w3cLink:
        "https://w3c.github.io/aria-practices/examples/combobox/aria1.1pattern/listbox-combo.html"
    };
  },
  computed: {
    aria() {
      const { expanded, localId, activeOptionIndex } = this;
      return {
        combobox: { expanded, owns: `${localId}-listbox`, haspopup: "listbox" },
        input: {
          autocomplete: "list",
          controls: `${localId}-listbox`,
          activedescendant:
            activeOptionIndex >= 0
              ? `${localId}-option-${activeOptionIndex}`
              : ""
        },
        listbox: { labelledby: `${localId}-label` }
      };
    },
    list() {
      const { value } = this;
      if (!value) {
        return [];
      }
      return FRUITS_AND_VEGGIES.filter(
        veggie =>
          veggie.toLowerCase().indexOf(value.toLowerCase()) === 0 &&
          veggie.length > value.length
      );
    }
  },
  methods: {
    focus() {
      clearTimeout(this.focusTimer);
      this.focused = true;
    },
    blur() {
      clearTimeout(this.focusTimer);
      this.activeOptionIndex = -1;
      this.focusTimer = setTimeout(() => {
        this.focused = false;
      }, 50);
    },
    choose(value) {
      this.value = value;
      this.$refs.input.focus();
    }
  }
};
</script>

<style scoped>
.combobox-wrapper {
  position: relative;
}
.listbox {
  position: absolute;
  top: 100%;
  left: 0;
  list-style: none;
  margin: 0;
  padding: 0;
  background-color: silver;
}
.listbox > li {
  padding: 0.25em 0.5em;
}
.listbox > li.selected,
.listbox > li:hover {
  background-color: gray;
}
</style>
