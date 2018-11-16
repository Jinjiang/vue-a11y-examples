<template>
  <div>
    <h1>Menubar Example</h1>
    <div class="content">
      <!-- todo: menubar as the first level -->
      <nav aria-label="Mythical University">
        <VueAria role="menubar">
          <VueMenu
            class="menubar"
            orientation="vertical"
            text="Mythical University"
            :items="menutree"
            @action="action"
          />
        </VueAria>
      </nav>
    </div>
    <ol>
      <li>
        You can use <kbd>ArrowUp</kbd> and <kbd>ArrowDown</kbd> to travel around
        the current menu level.
      </li>
      <li>
        You can use <kbd>ArrowLeft</kbd> or <kbd>ENTER</kbd> to go up a level
        menu or <kbd>ArrowRight</kbd> to go to a deeper level menu.
      </li>
      <li>
        You can press <kbd>ENTER</kbd> key when focus a leaf item to fire
        action.
      </li>
      <li>
        Related utils: <code>&lt;VueAria&gt;</code>, <code>MixinTravel</code>,
        <code>MixinShortcuts</code>.
      </li>
      <li>
        Ref: <a :href="w3cLink" target="_blank">{{ w3cLink }}</a>
      </li>
    </ol>
  </div>
</template>

<script>
import { VueAria } from "vue-a11y-utils";
import VueMenu from "../components/menu.vue";

const MENUTREE = [
  {
    text: "About",
    items: [
      { text: "Overview", value: "mb-about.html#overview" },
      { text: "Administration", value: "mb-about.html#admin" },
      {
        text: "Facts",
        items: [
          { text: "History", value: "mb-about.html#facts" },
          { text: "Current Statistics", value: "mb-about.html#facts" },
          { text: "Awards", value: "mb-about.html#facts" }
        ]
      },
      {
        text: "Campus",
        items: [
          { text: "For prospective students", value: "mb-about.html#tours" },
          { text: "For alumni", value: "mb-about.html#tours" },
          { text: "For visitors", value: "mb-about.html#tours" }
        ]
      }
    ]
  },
  {
    text: "Admissions",
    items: [
      { text: "Apply", value: "mb-admissions.html#apply" },
      {
        text: "Tuition",
        items: [
          { text: "Undergraduate", value: "mb-admissions.html#tuition" },
          { text: "Graduate", value: "mb-admissions.html#tuition" },
          { text: "Professional Schools", value: "mb-admissions.html#tuition" }
        ]
      },
      { text: "Sign Up", value: "mb-admissions.html#signup" },
      { text: "Visit", value: "mb-admissions.html#visit" },
      { text: "Photo Tour", value: "mb-admissions.html#photo" },
      { text: "Connect", value: "mb-admissions.html#connect" }
    ]
  },
  {
    text: "Academics",
    items: [
      { text: "Colleges & Schools", value: "mb-academics.html#colleges" },
      { text: "Programs of Study", value: "mb-academics.html#programs" },
      { text: "Honors Programs", value: "mb-academics.html#honors" },
      { text: "Online Courses", value: "mb-academics.html#online" },
      { text: "Course Explorer", value: "mb-academics.html#explorer" },
      { text: "Register for Class", value: "mb-academics.html#register" },
      { text: "Academic Calendar", value: "mb-academics.html#academic" },
      { text: "Transcripts", value: "mb-academics.html#tanscripts" }
    ]
  }
];

export default {
  components: { VueAria, VueMenu },
  data() {
    return {
      menutree: MENUTREE,
      w3cLink:
        "https://w3c.github.io/aria-practices/examples/menubar/menubar-1/menubar-1.html"
    };
  },
  methods: {
    action(event) {
      alert(`goto: ${event}`);
    }
  }
};
</script>
