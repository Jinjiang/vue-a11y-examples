<template>
  <p>
    <label :for="`${localId}-input`">
      {{ label }}<span v-if="required" aria-hidden="true">*</span>:
    </label>
    <VueAria :aria="{ required }">
      <input
        type="text"
        ref="input"
        value=""
        :name="name"
        :id="`${localId}-input`"
        :class="required ? 'required' : ''"
      />
    </VueAria>
  </p>
</template>

<script>
import { VueAria, MixinId } from "vue-a11y-utils";
export default {
  mixins: [MixinId],
  components: { VueAria },
  props: { name: String, label: String, required: Boolean },
  methods: {
    focus() {
      this.$refs.input.focus();
    }
  }
};
</script>
