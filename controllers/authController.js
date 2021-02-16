const bcrypt = require("bcrypt");

//  --------------- Login ---------------
// Login page
const get_login_page = (req, res) => {
  res.render("login", {
    messageRegisterSuccess: req.flash("messageRegisterSuccess"),
    messageNotRegistered: req.flash("messageNotRegistered"),
    messagePasswordIncorrect: req.flash("messagePasswordIncorrect"),
  });
};

// Connexion
const post_login = async (req, res) => {
  const { email, password } = req.body;

  // Vérifie si l'email existe
  const findEmail = await query(
    "SELECT COUNT(*) AS cnt FROM user WHERE email = ?",
    email
  );
  // L'email n'existe pas
  if (!findEmail[0].cnt > 0) {
    req.flash("messageNotRegistered", "Aucun utilisateur avec cet email."); // avec connect-flash
    return res.redirect("/auth/login");
  }

  // L'email existe : vérification du mot de passe
  const user = await query(
    "SELECT userID, firstname, lastname, email, password FROM user WHERE email = ?",
    email
  );
  const passwordCkeck = await bcrypt.compare(password, user[0].password);

  if (!passwordCkeck) {
    req.flash("messagePasswordIncorrect", "Mot de passe incorrect");
    return res.redirect("/auth/login");
  }
};

//  --------------- Register ---------------
// Register page
const get_register_page = (req, res) => {
  // req.flash : voir plus bas, message d'erreur si email déjà utilisé
  res.render("register", {
    messageEmailUsed: req.flash("messageEmailUsed"),
    messageError: req.flash("messageError"),
  });
};

// Register
const post_register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  // Vérifie si l'email existe
  const findEmail = await query(
    "SELECT COUNT(*) AS cnt FROM user WHERE email = ?",
    email
  );
  // console.log(findEmail[0].cnt);

  if (findEmail[0].cnt > 0) {
    req.flash("messageEmailUsed", "Email déjà utilisé"); // avec connect-flash
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
          req.flash("messageError", `Il y a une erreur ${err}`);
          return res.redirect("/auth/register");
        }
        req.flash(
          "messageRegisterSuccess",
          `Votre compte a bien été créé ! Vous pouvez vous connecter.`
        );
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
  post_login,
};
