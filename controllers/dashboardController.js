const get_dashboard_page = (req, res) => {
  const user = req.session.user;
  res.render("dashboard", { user });
};

module.exports = {
  get_dashboard_page,
};
