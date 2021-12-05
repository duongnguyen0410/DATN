export const columns = [
  {
    slots: { title: "ID" },
    key: "ID",
    dataIndex: "ID"
  },
  {
    slots: { title: "Name" },
    key: "Name",
    dataIndex: "Name",
    scopedSlots: {
      customRender: "Name"
    }
  },
  {
    slots: { title: "IDCreated" },
    key: "IDCreated",
    dataIndex: "IDCreated",
    scopedSlots: {
      customRender: "IDCreated"
    }
  },
  {
    slots: { title: "Sex" },
    key: "Sex",
    dataIndex: "Sex",
    scopedSlots: {
      customRender: "Sex"
    }
  },
  {
    slots: { title: "Email" },
    key: "Email",
    dataIndex: "Email",
    scopedSlots: {
      customRender: "Email"
    }
  },
  {
    slots: { title: "IDRole" },
    key: "IDRole",
    dataIndex: "IDRole",
    scopedSlots: {
      customRender: "IDRole"
    }
  },
  {
    slots: { title: "operation" },
    dataIndex: "operation",
    fixed: "right",
    width: 150,
    scopedSlots: {
      customRender: "operation"
    }
  }
];
