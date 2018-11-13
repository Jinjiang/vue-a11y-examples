<template>
  <div>
    <div>
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
      menutree: MENUTREE
    };
  },
  methods: {
    action(event) {
      alert(`goto: ${event}`);
    }
  }
};
</script>

<style></style>
