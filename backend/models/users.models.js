const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const usersUtils = require("../utils/usersUtils");

const createUser = async (data) => {
  try {
    await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        mail: data.mail,
        password: await usersUtils.hassPassword(data.password),
        birthday: data.birthday.toString(),
        gender: data.gender,
        permission: 0,
        secret: null,
        status: 0,
      },
    });
    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const getUserByMail = async (mail) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        mail: mail,
      },
    });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const saveOTP = async (id, secret) => {
  try {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        secret: secret,
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const removeOTP = async (id) => {
  try {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        secret: null,
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { createUser, getUserByMail, saveOTP, removeOTP };
