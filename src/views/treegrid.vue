<template>
  <div>
    <VueAria role="treegrid" :aria="{ label: 'Inbox' }">
      <table ref="table" class="table" @keydown="keyTravel">
        <VueAria
          v-for="(item, index) in list"
          :key="index"
          role="row"
          :aria="{
            level: item.level,
            posinset: item.posinset,
            setsize: item.setsize,
            expanded: item.expanded
          }"
          :tabindex="isCurrent(index, -1) ? 0 : -1"
        >
          <tr ref="rows" v-show="!item.hidden">
            <VueAria role="gridcell" :tabindex="isCurrent(index, 0) ? 0 : NaN">
              <td
                ref="subjects"
                :style="{ paddingLeft: `${item.level + 0.5}em` }"
              >
                <span
                  v-if="item.hasChildren"
                  style="
                    display: inline-block;
                    width: 1em;
                    height: 1em;
                    margin-left: -1em;
                  "
                  :style="{
                    backgroundColor: item.expanded ? 'silver' : 'gray'
                  }"
                  @click="toggle(index);"
                ></span>
                ({{ item.posinset }} / {{ item.setsize }}) {{ item.subject }}
              </td>
            </VueAria>
            <VueAria role="gridcell" :tabindex="isCurrent(index, 1) ? 0 : NaN">
              <td ref="summaries">{{ item.summary }}</td>
            </VueAria>
            <td role="gridcell">
              <a
                ref="emails"
                :href="`mailto:${item.email}`"
                :tabindex="isCurrent(index, 2) ? 0 : NaN"
              >
                {{ item.email }}
              </a>
            </td>
          </tr>
        </VueAria>
      </table>
    </VueAria>
  </div>
</template>

<script>
import { VueAria, MixinKeyTravel } from "vue-a11y-utils";

const EMAIL_LIST = [
  {
    subject: "Treegrids are awesome",
    summary: "Want to learn how to use them?",
    email: "aaron@thegoogle.rocks",
    threads: [
      {
        subject: "re: Treegrids are awesome",
        summary: "I agree with you, they are the shizzle",
        email: "joe@blahblahblah.blahblah"
      },
      {
        subject: "re: Treegrids are awesome",
        summary: "They are great for showing a lot of data, like a grid",
        email: "billy@dangerous.fish",
        threads: [
          {
            subject: "re: Treegrids are awesome",
            summary: "Cool, we've been needing an example and documentation",
            email: "doris@rufflazydogs.sleep"
          }
        ]
      },
      {
        subject: "re: Treegrids are awesome",
        summary:
          "I hear the Fancytree library is going to align with this example!",
        email: "someone@please-do-it.company",
        threads: [
          {
            subject: "re: Treegrids are awesome",
            summary:
              "Sometimes they are more like trees, others are more like grids",
            email: "mari@beingpractical.com",
            threads: [
              {
                subject: "re: Treegrids are awesome",
                summary:
                  "Cool, when it's a tree, let's keep left/right to collapse/expand",
                email: "issie@imadeadcatsadly.wascute"
              },
              {
                subject: "re: Treegrids are awesome",
                summary: "I see, sometimes right arrow moves by column",
                email: "kitten@kittenseason.future"
              }
            ]
          }
        ]
      }
    ]
  }
];

function flatten(target = [], list = [], level = 1) {
  const setsize = target.length;
  target.forEach((child, index) => {
    const { subject, summary, email, threads } = child;
    const item = {
      subject,
      summary,
      email,
      level,
      posinset: index + 1,
      setsize
    };
    list.push(item);
    item.hidden = level <= 2 ? false : true;
    if (threads && threads.length) {
      item.hasChildren = true;
      item.expanded = level === 1 ? true : false;
      flatten(threads, list, level + 1);
    }
  });
  return list;
}

export default {
  mixins: [MixinKeyTravel],
  components: { VueAria },
  data() {
    return {
      list: flatten(EMAIL_LIST),
      rowIndex: 0,
      columnIndex: -1
    };
  },
  methods: {
    toggle(index) {
      const { list } = this;
      const item = list[index];
      const { hasChildren, expanded } = item;
      if (!hasChildren) {
        return;
      }
      if (expanded) {
        this.collapse(index);
      } else {
        this.expand(index);
      }
      item.expanded = !item.expanded;
    },
    collapse(index) {
      const list = this.list;
      const level = list[index].level;
      list.some((child, i) => {
        if (i <= index) {
          return false;
        }
        if (child.level > level) {
          child.hidden = true;
          return false;
        }
        return true;
      });
    },
    expand(index) {
      const list = this.list;
      const level = list[index].level;
      const collapsedChildren = [];
      list.some((child, i) => {
        if (i <= index) {
          return false;
        }
        if (child.level > level) {
          child.hidden = false;
          // still set hidden if parent collapsed
          if (child.hasChildren && !child.expanded) {
            collapsedChildren.push(i);
          }
          return false;
        }
        return true;
      });
      collapsedChildren.forEach(index => this.collapse(index));
    },

    isCurrent(rowIndex, columnIndex) {
      return this.rowIndex === rowIndex && this.columnIndex === columnIndex;
    },
    updateFocus() {
      const { rowIndex, columnIndex } = this;
      setTimeout(() => {
        switch (columnIndex) {
          case 0:
            this.$refs.subjects[rowIndex].focus();
            break;
          case 1:
            this.$refs.summaries[rowIndex].focus();
            break;
          case 2:
            this.$refs.emails[rowIndex].focus();
            break;
          default:
            this.$refs.rows[rowIndex].focus();
        }
      });
    },
    getKeyItems() {
      return this.$refs.rows;
    },
    goNext(event) {
      if (event.key === "ArrowRight") {
        if (this.columnIndex < 2) {
          const item = this.list[this.rowIndex];
          if (this.columnIndex === -1 && item.hasChildren && !item.expanded) {
            this.toggle(this.rowIndex);
            event.preventDefault();
            return true;
          } else {
            this.columnIndex++;
            this.updateFocus();
            event.preventDefault();
            return true;
          }
        }
      } else {
        let nextRowIndex = this.rowIndex;
        if (nextRowIndex < this.list.length - 1) {
          nextRowIndex++;
          while (
            nextRowIndex < this.list.length &&
            this.list[nextRowIndex].hidden
          ) {
            nextRowIndex++;
          }
          if (nextRowIndex < this.list.length) {
            this.rowIndex = nextRowIndex;
            this.updateFocus();
            event.preventDefault();
            return true;
          }
        }
      }
    },
    goPrev(event) {
      if (event.key === "ArrowLeft") {
        const item = this.list[this.rowIndex];
        if (this.columnIndex === -1 && item.hasChildren && item.expanded) {
          this.toggle(this.rowIndex);
          event.preventDefault();
          return true;
        } else if (this.columnIndex >= 0) {
          this.columnIndex--;
          this.updateFocus();
          event.preventDefault();
          return true;
        }
      } else {
        let prevRowIndex = this.rowIndex;
        if (prevRowIndex > 0) {
          prevRowIndex--;
          while (prevRowIndex >= 0 && this.list[prevRowIndex].hidden) {
            prevRowIndex--;
          }
          if (prevRowIndex >= 0) {
            this.rowIndex = prevRowIndex;
            this.updateFocus();
            event.preventDefault();
            return true;
          }
        }
      }
    },
    goAction(event) {
      if (this.columnIndex === 0) {
        this.toggle(this.rowIndex);
        event.preventDefault();
        return true;
      }
      if (this.columnIndex === -1) {
        alert(`See "${this.list[this.rowIndex].subject}"!`);
        event.preventDefault();
        return true;
      }
    }
  }
};
</script>

<style scoped>
.table {
  border-collapse: collapse;
  box-sizing: border-box;
  width: 100%;
}
.table td {
  border: 1px solid gray;
  padding: 0.25em 0.5em;
  vertical-align: top;
}
</style>
