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
    slots: { title: "size" },
    dataIndex: "size",
    key: "size"
  },
  {
    slots: { title: "price" },
    dataIndex: "price",
    key: "price",
    scopedSlots: { customRender: "price" }
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
  price: [{ required: true, message: "Please not empty", trigger: "change" }],
  unit: [{ required: true, message: "Please not empty", trigger: "change" }]
};
