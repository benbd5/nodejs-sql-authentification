const get_login_page = (req, res) => {
  res.render("login");
};

const get_register_page = (req, res) => {
  res.render("register");
};

module.exports = {
  get_login_page,
  get_register_page,
};
