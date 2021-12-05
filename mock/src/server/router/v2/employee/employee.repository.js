const knex = require("../../../knex/knex");

const getListUser = () => {
  return knex("employee").select();
};

const getUserInfo = ID => {
  return knex("employee")
    .select()
    .where({ ID });
};

const updateUserInfo = async ({ ID, Name, Sex, IDRole, Email, Password }) => {
  let data = { ID, Name, Sex, IDRole, Email };
  if (Password) {
    await knex("users")
      .update({ Password })
      .where({ ID });
  }

  return knex("employee")
    .update(data)
    .where({ ID });
};

module.exports = {
  getListUser,
  getUserInfo,
  updateUserInfo
};
