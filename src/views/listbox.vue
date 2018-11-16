<template>
  <div>
    <h1>Scrollable Listbox Example</h1>
    <p>Choose your favorite transuranic element (actinide or transactinide).</p>
    <div>
      <span :id="`${localId}-label`">Transuranium elements:</span>
      <VueAria
        role="listbox"
        :tabindex="0"
        :aria="{
          labelledby: `${localId}-label`,
          activedescendant: current >= 0 ? `${localId}-option-${current}` : ''
        }"
      >
        <ul class="listbox" ref="listbox" @keydown="bindTravel">
          <VueAria
            v-for="(text, index) in options"
            :key="index"
            role="option"
            :aria="{ selected: index === current }"
          >
            <li
              :id="`${localId}-option-${index}`"
              ref="options"
              :class="{ 'option-selected': index === current }"
            >
              {{ text }}
            </li>
          </VueAria>
        </ul>
      </VueAria>
    </div>
    <ol>
      <li>
        When focused on one of the listbox, you can use <kbd>ArrowUp</kbd> and
        <kbd>ArrowDown</kbd> to travel around.
      </li>
      <li>
        Related utils: <code>&lt;VueAria&gt;</code>, <code>MixinTravel</code>,
        <code>MixinId</code>.
      </li>
      <li>
        Ref: <a :href="w3cLink" target="_blank">{{ w3cLink }}</a>
      </li>
    </ol>
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

const travelOption = {
  getItems(vm) {
    return vm.$refs.options;
  },
  getIndex(vm) {
    return vm.current;
  },
  setIndex(vm, index) {
    const items = this.getItems(vm);
    vm.current = index;
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
  $travel: travelOption,
  data() {
    return {
      options: OPTIONS,
      current: -1,
      w3cLink:
        "https://w3c.github.io/aria-practices/examples/listbox/listbox-scrollable.html"
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
