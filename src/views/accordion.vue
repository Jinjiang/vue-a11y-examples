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
          <AccordionInput name="name" label="Name" required />
          <AccordionInput name="email" label="Email" required />
          <AccordionInput name="phone" label="Phone" />
          <AccordionInput name="ext" label="Extension" />
          <AccordionInput name="country" label="Country" />
          <AccordionInput name="city_province" label="City/Province" />
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
          <AccordionInput name="b-add1" label="Address 1" />
          <AccordionInput name="b-add2" label="Address 1" />
          <AccordionInput name="b-city" label="City" />
          <AccordionInput name="b-state" label="State" />
          <AccordionInput name="b-zip" label="Zip Code" />
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
          <AccordionInput name="m-add1" label="Address 1" />
          <AccordionInput name="m-add2" label="Address 1" />
          <AccordionInput name="m-city" label="City" />
          <AccordionInput name="m-state" label="State" />
          <AccordionInput name="m-zip" label="Zip Code" />
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
import AccordionInput from "../components/accordion-input.vue";
export default {
  mixins: [MixinId, MixinKeyTravel],
  components: {
    AccordionPair,
    AccordionInput
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
}
.accordion fieldset {
  border: none;
}
</style>
