const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtKey = process.env.JWT_SECRET;

const hassPassword = async (password) => {
  try {
    const hash = await argon2.hash(password);
    return hash;
  } catch (error) {
    console.error("Erreur lors du hachage du mot de passe :", error);
    throw error;
  }
};

const comparePasswords = async (password, hash) => {
  try {
    const match = await argon2.verify(hash, password);
    return match;
  } catch (error) {
    console.error("Erreur lors de la comparaison des mots de passe :", error);
    throw error;
  }
};

const createToken = (data, stayOnline) => {
  return new Promise((resolve, reject) => {
    const expiresIn = stayOnline ? "7d" : "1h";
    jwt.sign(data, jwtKey, { expiresIn }, (err, token) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

const verifyToken = async (token) => {
  if (!token) {
    return "error token";
  }
  try {
    const decoded = await jwt.verify(token, jwtKey);
    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return "error token";
    } else {
      console.error(error);
    }
    return "error token";
  }
};

module.exports = {
  hassPassword,
  comparePasswords,
  createToken,
  verifyToken,
};
