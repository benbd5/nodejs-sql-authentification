const get_verify_auth = (req, res, next) => {
  if (req.session.user == undefined) {
    req.flash(
      "messageNotConnected",
      "Vous devez etre connecté pour accéder au tableau de bord"
    );
    return res.redirect("/auth/login");
  } else {
    next();
  }
};
module.exports = {
  get_verify_auth,
};
