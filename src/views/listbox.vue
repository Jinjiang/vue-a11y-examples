<template>
  <div>
    <p>Choose your favorite transuranic element (actinide or transactinide).</p>
    <div>
      <span :id="`${localId}-label`">Transuranium elements:</span>
      <VueAria
        role="listbox"
        :tabindex="0"
        :aria="{
          labelledby: `${localId}-label`,
          activedescendant:
            activeOptionIndex >= 0
              ? `${localId}-option-${activeOptionIndex}`
              : ''
        }"
      >
        <ul class="listbox" ref="listbox" @keydown="keyTravel">
          <VueAria
            v-for="(text, index) in options"
            :key="index"
            role="option"
            :aria="{ selected: index === activeOptionIndex }"
          >
            <li
              :id="`${localId}-option-${index}`"
              ref="options"
              :class="{ 'option-selected': index === activeOptionIndex }"
            >
              {{ text }}
            </li>
          </VueAria>
        </ul>
      </VueAria>
    </div>
  </div>
</template>

<script>
import { MixinId, MixinKeyTravel, VueAria } from "vue-a11y-utils";

const OPTIONS = [
  "Neptunium",
  "Plutonium",
  "Americium",
  "Curium",
  "Berkelium",
  "Californium",
  "Einsteinium",
  "Fermium",
  "Mendelevium",
  "Nobelium",
  "Lawrencium",
  "Rutherfordium",
  "Dubnium",
  "Seaborgium",
  "Bohrium",
  "Hassium",
  "Meitnerium",
  "Darmstadtium",
  "Roentgenium",
  "Copernicium",
  "Nihonium",
  "Flerovium",
  "Moscovium",
  "Livermorium",
  "Tennessine",
  "Oganesson"
];

export default {
  mixins: [MixinId, MixinKeyTravel],
  components: { VueAria },
  data() {
    return {
      options: OPTIONS,
      activeOptionIndex: -1
    };
  },
  methods: {
    getKeyItems() {
      return this.$refs.options;
    },
    goNext() {
      const options = this.getKeyItems();
      const length = options.length;
      if (!length) {
        return;
      }
      const { activeOptionIndex } = this;
      if (activeOptionIndex < 0 || activeOptionIndex === length - 1) {
        this.activeOptionIndex = 0;
      } else {
        this.activeOptionIndex++;
      }
      options[this.activeOptionIndex].scrollIntoView();
      return true;
    },
    goPrev() {
      const options = this.getKeyItems();
      const length = options.length;
      if (!length) {
        return;
      }
      const { activeOptionIndex } = this;
      if (activeOptionIndex <= 0) {
        this.activeOptionIndex = length - 1;
      } else {
        this.activeOptionIndex--;
      }
      options[this.activeOptionIndex].scrollIntoView();
      return true;
    },
    fireAction() {}
  }
};
</script>

<style scoped>
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
