<template>
  <div>
    <button @click="shown1 = true;">Add Delivery Address</button>
    <div class="dialog-layer" v-show="shown1">
      <VueFocusTrap
        v-if="shown1"
        ref="dialog1"
        :disabled="activeDialogIndex !== 1"
        @goinit="focus('dialog1First');"
        @gofirst="focus('dialog1First');"
        @golast="focus('dialog1Last');"
      >
        <VueAria
          role="dialog"
          :aria="{
            labelledby: `${localId}-dialog1-label`,
            modal: true
          }"
        >
          <div :id="`${localId}-dialog1`">
            <h2 :id="`${localId}-dialog1-label`">Add Delivery Address</h2>
            <div>
              <VueInput ref="dialog1First" label="Street" />
              <VueInput label="City" /> <VueInput label="State" />
              <VueInput label="Zip" />
              <p>
                <label :for="`${localId}-instructions`">
                  Special instructions:
                </label>
                <VueAria
                  :aria="{ describedby: `${localId}-instructions-desc` }"
                >
                  <input type="text" value="" :id="`${localId}-instructions`" />
                </VueAria>
              </p>
              <p :id="`${localId}-instructions-desc`">
                For example, gate code or other information to help the driver
                find you
              </p>
            </div>
            <div>
              <button @click="shown2 = true;">Verify Address</button>
              <button>Add</button>
              <button ref="dialog1Last" @click="shown1 = false;">Cancel</button>
            </div>
          </div>
        </VueAria>
      </VueFocusTrap>
      <VueFocusTrap
        v-if="shown2"
        ref="dialog2"
        :disabled="activeDialogIndex !== 2"
        @goinit="focus('dialog2Init');"
        @gofirst="focus('dialog2First');"
        @golast="focus('dialog2Last');"
      >
        <VueAria
          role="dialog"
          :aria="{
            labelledby: `${localId}-dialog2-label`,
            describedby: `${localId}-dialog2-desc`,
            modal: true
          }"
        >
          <div :id="`${localId}-dialog2`">
            <h2 :id="`${localId}-dialog2-label`">Verification Result</h2>
            <div :id="`${localId}-dialog1-desc`">
              <p tabindex="-1" ref="dialog2Init">
                This is just a demonstration. If it were a real application, it
                would provide a message telling whether the entered address is
                valid.
              </p>
              <p>
                For demonstration purposes, this dialog has a lot of text. It
                demonstrates a scenario where:
              </p>
              <ul>
                <li>
                  The first interactive element, the help link, is at the bottom
                  of the dialog.
                </li>
                <li>
                  If focus is placed on the first interactive element when the
                  dialog opens, the validation message may not be visible.
                </li>
                <li>
                  If the validation message is visible and the focus is on the
                  help link, then the focus may not be visible.
                </li>
                <li>
                  When the dialog opens, it is important that both:
                  <ul>
                    <li>
                      The beginning of the text is visible so users do not have
                      to scroll back to start reading.
                    </li>
                    <li>The keyboard focus always remains visible.</li>
                  </ul>
                </li>
              </ul>
              <p>There are several ways to resolve this issue:</p>
              <ul>
                <li>
                  Place an interactive element at the top of the dialog, e.g., a
                  button or link.
                </li>
                <li>
                  Make a static element focusable, e.g., the dialog title or the
                  first block of text.
                </li>
              </ul>
              <p>
                Please <em> DO NOT </em> make the element with role dialog
                focusable!
              </p>
              <ul>
                <li>
                  The larger a focusable element is, the more difficult it is to
                  visually identify the location of focus, especially for users
                  with a narrow field of view.
                </li>
                <li>
                  The dialog has a visual border, so creating a clear visual
                  indicator of focus when the entire dialog has focus is not
                  very feasible.
                </li>
                <li>
                  Screen readers read the label and content of focusable
                  elements. The dialog contains its label and a lot of content!
                  If a dialog like this one has focus, the actual focus is
                  difficult to comprehend.
                </li>
              </ul>
              <p>
                In this dialog, the first paragraph has
                <code> tabindex= <q> -1 </q> </code> . The first paragraph is
                also contained inside the element that provides the dialog
                description, i.e., the element that is referenced by
                <code> aria-describedby </code> . With some screen readers, this
                may have one negative but relatively insignificant side effect
                when the dialog opens -- the first paragraph may be announced
                twice. Nonetheless, making the first paragraph focusable and
                setting the initial focus on it is the most broadly accessible
                option.
              </p>
            </div>
            <div>
              <a href="#" ref="dialog2First" @click.prevent="shown3 = true;"
                >link to help</a
              >
              <button @click="shown3 = true;">
                accepting an alternative form
              </button>
              <button ref="dialog2Last" @click="shown2 = false;">Close</button>
            </div>
          </div>
        </VueAria>
      </VueFocusTrap>
      <VueFocusTrap
        v-if="shown3"
        ref="dialog3"
        :disabled="activeDialogIndex !== 3"
        @goinit="focus('dialog3First');"
        @gofirst="focus('dialog3First');"
        @golast="focus('dialog3First');"
      >
        <VueAria
          role="dialog"
          :aria="{
            labelledby: `${localId}-dialog3-label`,
            describedby: `${localId}-dialog3-desc`,
            modal: true
          }"
        >
          <div :id="`${localId}-dialog3`">
            <h2 :id="`${localId}-dialog3-label`">End of the Road!</h2>
            <p :id="`${localId}-dialog3-desc`">
              You activated a fake link or button that goes nowhere! The link or
              button is present for demonstration purposes only.
            </p>
            <div>
              <button ref="dialog3First" @click="shown3 = false;">Close</button>
            </div>
          </div>
        </VueAria>
      </VueFocusTrap>
    </div>
  </div>
</template>

<script>
import { VueFocusTrap, VueAria, MixinId } from "vue-a11y-utils";
import VueInput from "../components/input.vue";

const focusStack = [];

export default {
  mixins: [MixinId],
  components: { VueFocusTrap, VueAria, VueInput },
  data() {
    return {
      shown1: false,
      shown2: false,
      shown3: false,
      activeDialogIndex: 0
    };
  },
  watch: {
    shown1(value) {
      if (value) {
        this.activeDialogIndex = 1;
        focusStack.push(document.activeElement);
        this.$nextTick(() => {
          this.$refs.dialog1.$emit("goinit");
        });
      } else {
        this.activeDialogIndex = 0;
        const target = focusStack.pop();
        this.$nextTick(() => {
          target.focus();
        });
      }
    },
    shown2(value) {
      if (value) {
        this.activeDialogIndex = 2;
        focusStack.push(document.activeElement);
        this.$nextTick(() => {
          this.$refs.dialog2.$emit("goinit");
        });
      } else {
        this.activeDialogIndex = 1;
        const target = focusStack.pop();
        this.$nextTick(() => {
          target.focus();
        });
      }
    },
    shown3(value) {
      if (value) {
        this.activeDialogIndex = 3;
        focusStack.push(document.activeElement);
        this.$nextTick(() => {
          this.$refs.dialog3.$emit("goinit");
        });
      } else {
        this.activeDialogIndex = 2;
        const target = focusStack.pop();
        this.$nextTick(() => {
          target.focus();
        });
      }
    }
  },
  methods: {
    focus(refName) {
      const item = this.$refs[refName];
      item.focus();
    }
  }
};
</script>

<style>
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
