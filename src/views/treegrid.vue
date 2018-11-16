<template>
  <div>
    <h1>Treegrid Example</h1>
    <VueAria role="treegrid" :aria="{ label: 'Inbox' }">
      <table
        ref="table"
        class="table"
        @keydown="bindTravel($event, 'column'), bindTravel($event, 'row');"
      >
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
          :tabindex="isCurrent(index, 0) ? 0 : -1"
        >
          <tr ref="rows" v-show="!item.hidden">
            <VueAria role="gridcell" :tabindex="isCurrent(index, 1) ? 0 : NaN">
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
            <VueAria role="gridcell" :tabindex="isCurrent(index, 2) ? 0 : NaN">
              <td ref="summaries">{{ item.summary }}</td>
            </VueAria>
            <td role="gridcell">
              <a
                ref="emails"
                :href="`mailto:${item.email}`"
                :tabindex="isCurrent(index, 3) ? 0 : NaN"
              >
                {{ item.email }}
              </a>
            </td>
          </tr>
        </VueAria>
      </table>
    </VueAria>
    <ol>
      <li>
        You can use <kbd>Arrow</kbd> keys to travel around the whole tree grid.
        For examples focusing every rows and every cells, expanding/collapsing
        every email thread.
      </li>
      <li>
        You can press <kbd>ENTER</kbd> key to fire an action when you focus on a
        row.
      </li>
      <li>
        You can press <kbd>ENTER</kbd> key to expand/collapse a email thread
        when you focus on the first column of it.
      </li>
      <li>
        Related utils: <code>&lt;VueAria&gt;</code>, <code>MixinTravel</code>.
      </li>
      <li>
        Ref: <a :href="w3cLink" target="_blank">{{ w3cLink }}</a>
      </li>
    </ol>
  </div>
</template>

<script>
import { VueAria, MixinTravel } from "vue-a11y-utils";

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

const travelOption = {
  column: {
    orientation: "horizontal",
    getItems() {
      return ["rows", "subjects", "summaries", "emails"];
    },
    getIndex(vm) {
      return vm.columnIndex;
    },
    setIndex(vm, index) {
      vm.columnIndex = index;
      vm.updateFocus();
    },
    move(vm, event, newIndex, oldIndex) {
      event.preventDefault();
      const rowData = vm.list[vm.rowIndex];
      if (newIndex === -1 && oldIndex === 0) {
        if (rowData.hasChildren && rowData.expanded) {
          vm.toggle(vm.rowIndex);
        }
        return;
      }
      if (
        newIndex === 1 &&
        oldIndex === 0 &&
        rowData.hasChildren &&
        !rowData.expanded
      ) {
        vm.toggle(vm.rowIndex);
        return;
      }
      if (newIndex > 3) {
        return;
      }
      this.setIndex(vm, newIndex);
    },
    action(vm, event, index) {
      const rowData = vm.list[vm.rowIndex];
      if (rowData.hasChildren && index === 1) {
        event.preventDefault();
        vm.toggle(vm.rowIndex);
      }
      if (index === 0) {
        event.preventDefault();
        alert(`See "${rowData.subject}"!`);
      }
    }
  },
  row: {
    getItems(vm) {
      return vm.list.filter(item => !item.hidden);
    },
    getIndex(vm) {
      const visibleItems = this.getItems(vm);
      const { rowIndex, list } = vm;
      return visibleItems.indexOf(list[rowIndex]);
    },
    setIndex(vm, index) {
      const visibleItems = this.getItems(vm);
      const { list } = vm;
      const rowIndex = list.indexOf(visibleItems[index]);
      vm.rowIndex = rowIndex;
      vm.updateFocus();
    },
    move(vm, event, newIndex, oldIndex, items) {
      event.preventDefault();
      if (newIndex === -1 || newIndex === items.length) {
        return;
      }
      this.setIndex(vm, newIndex);
    }
  }
};

export default {
  mixins: [MixinTravel],
  components: { VueAria },
  $travel: travelOption,
  data() {
    return {
      list: flatten(EMAIL_LIST),
      rowIndex: 0,
      columnIndex: 0,
      w3cLink:
        "https://w3c.github.io/aria-practices/examples/treegrid/treegrid-1.html"
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
          case 1:
            this.$refs.subjects[rowIndex].focus();
            break;
          case 2:
            this.$refs.summaries[rowIndex].focus();
            break;
          case 3:
            this.$refs.emails[rowIndex].focus();
            break;
          default:
            this.$refs.rows[rowIndex].focus();
        }
      }, 50);
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
