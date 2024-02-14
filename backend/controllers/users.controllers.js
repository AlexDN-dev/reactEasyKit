const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

const usersModels = require("../models/users.models");
const usersUtils = require("../utils/usersUtils");

const createUser = async (req, res) => {
  try {
    const user = req.body;
    const userOnDB = await usersModels.getUserByMail(user.mail);
    if (userOnDB === null) {
      const responseFromDB = await usersModels.createUser(user);
      if (responseFromDB) {
        res.status(200).json({
          title: "Succès !",
          message: "Inscription réussite !",
          type: "success",
        });
      } else {
        res.json({
          title: "Erreur !",
          message: "Une erreur est survenue sur le serveur.",
          type: "error",
        });
      }
    } else {
      res.json({
        title: "Erreur !",
        message: "Un compte existe déjà avec cette adresse mail.",
        type: "error",
      });
    }
  } catch (error) {
    res.status(500).json({ erreur: "Une erreur est survenue : " + error });
  }
};
const loginUser = async (req, res) => {
  try {
    const user = req.body;
    const userOnDB = await usersModels.getUserByMail(user.mail);
    if (userOnDB !== null) {
      if (await usersUtils.comparePasswords(user.password, userOnDB.password)) {
        if (userOnDB.status === -1) {
          res.json({
            title: "Erreur !",
            message: "Ce compte a été suspendu par un administrateur.",
            type: "error",
          });
        } else if (userOnDB.status === 0) {
          res.json({
            title: "Avertissement",
            message:
              "Merci de bien vouloir valider ce compte via le mail envoyé.",
            type: "warning",
          });
        } else {
          if (userOnDB.secret === null) {
            const data = {
              id: userOnDB.id,
              mail: userOnDB.mail,
            };
            usersUtils
              .createToken(data, user.stayOnline)
              .then((token) => {
                res.status(200).json(token);
              })
              .catch((error) => console.error(error));
          } else {
            res.status(200).json("2FA ON");
          }
        }
      } else {
        res.json({
          title: "Erreur !",
          message: "Cette combinaison mot de passe / email ne fonctionne pas.",
          type: "error",
        });
      }
    } else {
      res.json({
        title: "Erreur !",
        message: "Cette combinaison mot de passe / email ne fonctionne pas.",
        type: "error",
      });
    }
  } catch (error) {
    res.status(500).json({ erreur: "Une erreur est survenue : " + error });
  }
};

const getUserInformations = async (req, res) => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    return res.sendStatus(403);
  }

  const bearerToken = bearerHeader.split(" ")[1];
  try {
    const decoded = await usersUtils.verifyToken(bearerToken);
    if (decoded === "error token") {
      return res.sendStatus(403);
    } else {
      const data = await usersModels.getUserByMail(decoded.mail);
      const doubleAuth = !!data.secret;

      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        mail: data.mail,
        permission: data.permission,
        doubleAuth,
        birthday: data.birthday,
        gender: data.gender,
      };

      res.status(200).json(userData);
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};
const setupOTP = async (req, res) => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    return res.sendStatus(403);
  }
  const bearerToken = bearerHeader.split(" ")[1];
  try {
    const token = await usersUtils.verifyToken(bearerToken);
    if (token === "error token") {
      return res.sendStatus(403);
    }
    const secret = speakeasy.generateSecret({ length: 20 });
    const otpauthUrl = speakeasy.otpauthURL({
      secret: secret.base32,
      label: "reactTemplate",
    });
    QRCode.toDataURL(otpauthUrl, (err, data_url) => {
      if (err) {
        res.status(500).send("Error generating QR code");
      } else {
        res.json({
          secret: secret.base32,
          qrCodeUrl: data_url,
        });
      }
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};
const confirmOTP = async (req, res) => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    return res.sendStatus(403);
  }
  const bearerToken = bearerHeader.split(" ")[1];
  try {
    const { code, secret } = req.body;
    const token = await usersUtils.verifyToken(bearerToken);
    if (token === "error token") {
      return res.sendStatus(403);
    } else {
      const verified = speakeasy.totp.verify({
        secret: secret,
        token: code,
      });
      if (verified) {
        await usersModels.saveOTP(token.id, secret);
        res.json({ success: true });
      } else {
        res.status(403).json({ success: false, message: "Invalid OTP" });
      }
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
const removeOTP = async (req, res) => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    return res.sendStatus(403);
  }
  const bearerToken = bearerHeader.split(" ")[1];
  try {
    const { code } = req.body;
    const token = await usersUtils.verifyToken(bearerToken);
    if (token === "error token") {
      return res.sendStatus(403);
    } else {
      const user = await usersModels.getUserByMail(token.mail);
      const verified = speakeasy.totp.verify({
        secret: user.secret,
        token: code,
      });
      if (verified) {
        await usersModels.removeOTP(user.id);
        res.json({ success: true });
      } else {
        res.status(403).json({ success: false, message: "Invalid OTP" });
      }
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
const needOTP = async (req, res) => {
  try {
    const user = req.body.user;
    const code = req.body.code;
    const userOnDB = await usersModels.getUserByMail(user.mail);
    const verified = speakeasy.totp.verify({
      secret: userOnDB.secret,
      token: code,
    });
    if (verified) {
      const data = {
        id: userOnDB.id,
        mail: userOnDB.mail,
      };
      usersUtils
        .createToken(data, user.stayOnline)
        .then((token) => {
          res.status(200).json(token);
        })
        .catch((error) => console.error(error));
    } else {
      res.status(403).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

module.exports = {
  createUser,
  loginUser,
  getUserInformations,
  setupOTP,
  confirmOTP,
  removeOTP,
  needOTP,
};
