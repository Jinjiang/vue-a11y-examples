<template>
  <div>
    <h1>Modal Dialog Example</h1>
    <button @click="open('dialog1');">Add Delivery Address</button>
    <div
      class="dialog-layer"
      v-show="shown.dialog1 || shown.dialog2 || shown.dialog3"
    >
      <VueFocusTrap
        v-if="shown.dialog1"
        ref="dialog1"
        @keydown.esc.native.prevent="close('dialog1');"
        @open="$event || focus('dialog1First');"
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
              <button @click="open('dialog2');">Verify Address</button>
              <button>Add</button>
              <button ref="dialog1Last" @click="close('dialog1');">
                Cancel
              </button>
            </div>
          </div>
        </VueAria>
      </VueFocusTrap>
      <VueFocusTrap
        v-if="shown.dialog2"
        ref="dialog2"
        @keydown.esc.native.prevent="close('dialog2');"
        @open="$event || focus('dialog2Init');"
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
              <a href="#" ref="dialog2First" @click.prevent="open('dialog3');"
                >link to help</a
              >
              <button @click="open('dialog3');">
                accepting an alternative form
              </button>
              <button ref="dialog2Last" @click="close('dialog2');">
                Close
              </button>
            </div>
          </div>
        </VueAria>
      </VueFocusTrap>
      <VueFocusTrap
        v-if="shown.dialog3"
        ref="dialog3"
        @keydown.esc.native.prevent="close('dialog3');"
        @open="$event || focus('dialog3First');"
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
              <button ref="dialog3First" @click="close('dialog3');">
                Close
              </button>
            </div>
          </div>
        </VueAria>
      </VueFocusTrap>
    </div>
    <ol>
      <li>You can freely open/close any modal dialogs without losing focus.</li>
      <li>
        Everything actionable in the current active modal dialog is always in
        the <kbd>TAB</kbd> sequence.
      </li>
      <li>
        You can use <kbd>ESC</kbd> key to close the current modal dialog
        quickly.
      </li>
      <li>
        Related utils: <code>&lt;VueAria&gt;</code>,
        <code>&lt;VueFocusTrap&gt;</code>, <code>MixinId</code>.
      </li>
      <li>
        Ref: <a :href="w3cLink" target="_blank">{{ w3cLink }}</a>
      </li>
    </ol>
  </div>
</template>

<script>
import { VueFocusTrap, VueAria, MixinId } from "vue-a11y-utils";
import VueInput from "../components/input.vue";

export default {
  mixins: [MixinId],
  components: { VueFocusTrap, VueAria, VueInput },
  data() {
    return {
      shown: {
        dialog1: false,
        dialog2: false,
        dialog3: false
      },
      w3cLink:
        "https://w3c.github.io/aria-practices/examples/dialog-modal/dialog.html"
    };
  },
  methods: {
    focus(name) {
      const item = this.$refs[name];
      item.focus();
    },
    open(name) {
      this.shown[name] = true;
      setTimeout(() => {
        this.$refs[name].open();
      }, 50);
    },
    close(name) {
      this.$refs[name].close(true);
      this.shown[name] = false;
    }
  }
};
</script>

<style scoped>
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
