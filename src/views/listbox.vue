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
        <ul class="listbox" ref="listbox" @keydown="travel">
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
import { MixinId, MixinTravel, VueAria } from "vue-a11y-utils";

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

const travel = {
  getItems(vm) {
    return vm.$refs.options;
  },
  getIndex(vm) {
    return vm.activeOptionIndex;
  },
  setIndex(vm, index) {
    const items = this.getItems(vm);
    vm.activeOptionIndex = index;
    items[index].scrollIntoView();
  },
  move(vm, event, newIndex, oldIndex, items) {
    event.preventDefault();
    if (newIndex === -1 || newIndex === items.length) {
      return;
    }
    this.setIndex(vm, newIndex);
  }
};

export default {
  mixins: [MixinId, MixinTravel],
  components: { VueAria },
  travel,
  data() {
    return {
      options: OPTIONS,
      activeOptionIndex: -1
    };
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
