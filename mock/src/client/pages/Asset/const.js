export const columns = [
  {
    slots: { title: "name" },
    dataIndex: "name",
    key: "name",
    scopedSlots: {
      filterDropdown: "filterDropdown",
      filterIcon: "filterIcon"
    }
  },
  {
    slots: { title: "count" },
    dataIndex: "count",
    key: "count"
  },
  {
    slots: { title: "unit" },
    dataIndex: "unit",
    key: "unit",
    scopedSlots: {
      filterDropdown: "filterDropdown",
      filterIcon: "filterIcon"
    }
  },
  {
    slots: { title: "" },
    key: "operation",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    width: 10
  }
];
export const rules = {
  name: [{ required: true, message: "Please not empty", trigger: "change" }],
  unit: [{ required: true, message: "Please not empty", trigger: "change" }]
};
