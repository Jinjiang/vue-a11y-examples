<template>
  <div>
    <h1>Accordion Example</h1>
    <div class="accordion">
      <AccordionPair
        title="Personal Information"
        ref="item1"
        :expanded="currentIndex === 0"
        @trigger="currentIndex = 0;"
        @keydown.native="keyTravel"
      >
        <fieldset>
          <VueInput name="name" label="Name" required />
          <VueInput name="email" label="Email" required />
          <VueInput name="phone" label="Phone" />
          <VueInput name="ext" label="Extension" />
          <VueInput name="country" label="Country" />
          <VueInput name="city_province" label="City/Province" />
        </fieldset>
      </AccordionPair>

      <AccordionPair
        title="Billing Address"
        ref="item2"
        :expanded="currentIndex === 1"
        @trigger="currentIndex = 1;"
        @keydown.native="keyTravel"
      >
        <fieldset>
          <VueInput name="b-add1" label="Address 1" />
          <VueInput name="b-add2" label="Address 1" />
          <VueInput name="b-city" label="City" />
          <VueInput name="b-state" label="State" />
          <VueInput name="b-zip" label="Zip Code" />
        </fieldset>
      </AccordionPair>

      <AccordionPair
        title="Shipping Address"
        ref="item3"
        :expanded="currentIndex === 2"
        @trigger="currentIndex = 2;"
        @keydown.native="keyTravel"
      >
        <fieldset>
          <VueInput name="m-add1" label="Address 1" />
          <VueInput name="m-add2" label="Address 1" />
          <VueInput name="m-city" label="City" />
          <VueInput name="m-state" label="State" />
          <VueInput name="m-zip" label="Zip Code" />
        </fieldset>
      </AccordionPair>
    </div>
    <ol>
      <li>
        All accordion tabs and the inputs in each accordion panel are included
        in the page <kbd>Tab</kbd> sequence
      </li>
      <li>
        Supported <kbd>ArrowDown</kbd> and <kbd>ArrowUp</kbd> when an accordion
        tab focused.
      </li>
      <li>
        Related utils: <code>&lt;VueAria&gt;</code>, <code>MixinId</code>,
        <code>MixinKeyTravel</code>.
      </li>
      <li>
        Ref: <a :href="w3cLink" target="_blank">{{ w3cLink }}</a>
      </li>
    </ol>
  </div>
</template>

<script>
import { MixinId, MixinKeyTravel } from "vue-a11y-utils";
import AccordionPair from "../components/accordion-pair.vue";
import VueInput from "../components/input.vue";
export default {
  mixins: [MixinId, MixinKeyTravel],
  components: {
    AccordionPair,
    VueInput
  },
  data() {
    return {
      currentIndex: 0,
      orientation: "vertical",
      w3cLink:
        "https://w3c.github.io/aria-practices/examples/accordion/accordion.html"
    };
  },
  methods: {
    getKeyItems() {
      const { item1, item2, item3 } = this.$refs;
      return [item1, item2, item3];
    },
    goNext(event) {
      const items = this.getKeyItems();
      const target = event.target;
      const focusedIndex = items.map(item => item.$refs.tab).indexOf(target);
      const nextIndex = focusedIndex < items.length - 1 ? focusedIndex + 1 : 0;
      items[nextIndex].focus();
    },
    goPrev(event) {
      const items = this.getKeyItems();
      const target = event.target;
      const focusedIndex = items.map(item => item.$refs.tab).indexOf(target);
      const prevIndex = focusedIndex > 0 ? focusedIndex - 1 : items.length - 1;
      items[prevIndex].focus();
    },
    goFirst() {
      const items = this.getKeyItems();
      items[0].focus();
    },
    goLast() {
      const items = this.getKeyItems();
      items[items.length - 1].focus();
    },
    fireAction() {}
  }
};
</script>

<style>
.accordion {
  border: 1px solid gray;
  border-radius: 5px;
}
.accordion fieldset {
  border: none;
}
</style>
