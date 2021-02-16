const bcrypt = require("bcrypt");

const get_login_page = (req, res) => {
  res.render("login");
};

const get_register_page = (req, res) => {
  res.render("register");
};

const post_register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  // Email existe
  const findEmail = await query(
    "SELECT COUNT(*) AS cnt FROM user WHERE email = ?",
    email
  );
  console.log(findEmail[0].cnt);

  if (findEmail[0].cnt > 0) {
    console.log("Email deja utilise");
    return res.redirect("/auth/register");
  }

  // Ajouter un utilisateur
  try {
    // Hashrt le mdp
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await query(
      "INSERT INTO user (firstname, lastname, email, password) VALUES (?,?,?,?)",
      [firstname, lastname, email, hash],
      (err, result) => {
        if (err) {
          return res.redirect("/auth/register");
        }
        return res.redirect("/auth/login");
      }
    );
  } catch (error) {
    res, status(400).json({ message: error });
  }
};

module.exports = {
  get_login_page,
  get_register_page,
  post_register,
};
