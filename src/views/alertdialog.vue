<template>
  <div>
    <p><label :for="`${localId}-notes`">Notes</label></p>
    <p>
      <textarea
        :id="`${localId}-notes`"
        ref="text"
        v-model="text"
        rows="10"
        style="width: 100%;"
      />
    </p>
    <p>
      <VueAria
        :aria="{ controls: `${localId}-notes`, disabled: text === saved }"
      >
        <button :disabled="text === saved" @click="save">Save</button>
      </VueAria>
      <VueAria :aria="{ controls: `${localId}-notes`, disabled: text === '' }">
        <button :disabled="text === ''" @click="shown2 = true;">Discard</button>
      </VueAria>
    </p>
    <div v-if="shown1" role="alert" class="alert">Saved</div>
    <div v-show="shown2" class="dialog-layer">
      <VueFocusTrap
        v-if="shown2"
        ref="dialog2"
        :disabled="!shown2"
        @keydown.esc.native="shown2 = false;"
        @goinit="focus('dialog2First');"
        @gofirst="focus('dialog2First');"
        @golast="focus('dialog2Last');"
      >
        <VueAria
          role="alertdialog"
          :aria="{
            labelledby: `${localId}-label`,
            describedby: `${localId}-desc`,
            modal: true
          }"
        >
          <div :id="`${localId}-alertdialog2`">
            <h2 :id="`${localId}-label`">Confirmation</h2>
            <div :id="`${localId}-desc`">
              <p>Are you sure you want to discard all of your notes?</p>
            </div>
            <div>
              <button ref="dialog2First" @click="shown2 = false;">No</button>
              <button ref="dialog2Last" @click="(shown2 = false), discard();">
                Yes
              </button>
            </div>
          </div>
        </VueAria>
      </VueFocusTrap>
    </div>
  </div>
</template>

<script>
import { VueFocusTrap, VueAria, MixinId } from "vue-a11y-utils";

const focusStack = [];

export default {
  mixins: [MixinId],
  components: { VueFocusTrap, VueAria },
  data() {
    const result = {
      shown1: false,
      shown2: false,
      text:
        "This is an example text box, which unsurprisingly contains text. The user is given the option to save this text - which triggers a basic alert - or to discard the text - which triggers an alert dialog that prompts the user for confirmation.",
      activeDialogIndex: 0
    };
    result.saved = result.text;
    return result;
  },
  watch: {
    shown2(value) {
      if (value) {
        this.activeDialogIndex = 2;
        focusStack.push(document.activeElement);
        this.$nextTick(() => {
          this.$refs.dialog2.$emit("goinit");
        });
      } else {
        this.activeDialogIndex = 0;
        const target = focusStack.pop();
        this.$nextTick(() => {
          this.text ? target.focus() : this.$refs.text.focus();
        });
      }
    }
  },
  methods: {
    save() {
      this.saved = this.text;
      this.shown1 = true;
      setTimeout(() => {
        this.shown1 = false;
      }, 3000);
    },
    discard() {
      this.text = "";
    },
    focus(refName) {
      const item = this.$refs[refName];
      item.focus();
    }
  }
};
</script>

<style scoped>
.alert {
  position: fixed;
  top: 2em;
  right: 2em;
  background-color: silver;
  border-radius: 5px;
  padding: 1em 2em;
}
.dialog-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
}
.dialog-layer > * {
  position: absolute;
  top: 20vh;
  left: 20vw;
  right: 20vw;
  bottom: 20vh;
  background-color: silver;
  border-radius: 5px;
  overflow: auto;
  padding: 1em 2em;
}
</style>
