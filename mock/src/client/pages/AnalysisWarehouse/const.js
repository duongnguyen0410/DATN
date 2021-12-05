export const columns = [
  {
    slots: { title: "type" },
    dataIndex: "type",
    key: "type",
    scopedSlots: {
      customRender: "type",
      filterDropdown: "filterDropdown",
      filterIcon: "filterIcon"
    }
  },
  {
    slots: { title: "created_at" },
    dataIndex: "created_at",
    key: "created_at",
    scopedSlots: {
      customRender: "created_at"
    }
  }
];
export const rules = {
  name: [{ required: true, message: "Please not empty", trigger: "change" }],
  unit: [{ required: true, message: "Please not empty", trigger: "change" }]
};
