<template>
  <div>
    <label :id="`${localId}-label`" :for="`${localId}-input`"
      >Choice 1 Fruit or Vegetable</label
    >
    <div class="combobox-wrapper">
      <div
        :id="`${localId}-combobox`"
        class="combobox"
        role="combobox"
        v-aria="aria.combobox"
      >
        <input
          :id="`${localId}-input`"
          class="input"
          v-aria="aria.input"
          v-model="value"
          @focus="focused = true;"
          @blur="focused = false;"
          @keydown="keyTravel"
        />
      </div>
      <ul
        v-if="focused && list.length"
        :id="`${localId}-listbox`"
        class="listbox"
        role="listbox"
        v-aria="aria.listbox"
      >
        <li
          v-for="(veggie, index) in list"
          :key="index"
          ref="options"
          role="option"
          :id="`${localId}-option-${index}`"
          :class="{ 'option-selected': index === activeOptionIndex }"
          v-aria="{ selected: index === activeOptionIndex }"
        >
          {{ veggie }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { MixinId, MixinKeyTravel, directiveAria } from "vue-a11y-utils";
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
  mixins: [MixinId, MixinKeyTravel],
  directives: { aria: directiveAria },
  data() {
    return {
      expanded: false,
      activeOptionIndex: -1,
      value: "",
      focused: false
    };
  },
  watch: {
    focused(value) {
      if (!value) {
        this.activeOptionIndex = -1;
      }
    }
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
    getKeyItems() {
      return this.$refs.options;
    },
    goNext() {
      const length = this.getKeyItems().length;
      if (!length) {
        return;
      }
      const { activeOptionIndex } = this;
      if (activeOptionIndex < 0 || activeOptionIndex === length - 1) {
        this.activeOptionIndex = 0;
      } else {
        this.activeOptionIndex++;
      }
      return true;
    },
    goPrev() {
      const length = this.getKeyItems().length;
      if (!length) {
        return;
      }
      const { activeOptionIndex } = this;
      if (activeOptionIndex <= 0) {
        this.activeOptionIndex = length - 1;
      } else {
        this.activeOptionIndex--;
      }
      return true;
    },
    fireAction() {
      const { list, activeOptionIndex } = this;
      const newValue = list[activeOptionIndex];
      if (newValue) {
        this.value = newValue;
      }
      return true;
    }
  }
};
</script>

<style>
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
.listbox > li.option-selected {
  background-color: gray;
}
</style>
