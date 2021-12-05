export const columns = [
  {
    slots: { title: "cashier_name" },
    dataIndex: "cashier_name",
    key: "cashier_name",
    scopedSlots: {
      filterDropdown: "filterDropdown",
      filterIcon: "filterIcon"
    }
  },
  {
    slots: { title: "customer_name" },
    dataIndex: "customer_name",
    key: "customer_name"
  },
  {
    slots: { title: "time_check_in" },
    dataIndex: "time_check_in",
    key: "time_check_in",
    scopedSlots: { customRender: "time_check_in" }
  },
  {
    slots: { title: "total_price" },
    dataIndex: "total_price",
    key: "total_price",
    scopedSlots: { customRender: "total_price" }
  },
  {
    slots: { title: "" },
    key: "operation",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    width: 10
  }
];
