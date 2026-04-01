import UserRepository from "../repositories/userRepository.mjs";

const UserService = {

  fetchUser: async (userId) => {
    const user = await UserRepository.findById(userId);

    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    const { password: _password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  },
};

export default UserService;