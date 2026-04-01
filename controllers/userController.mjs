import UserService from "../service/userService.mjs";

const UserController = {
  fetchUser: async (req, res, next) => {
    try {
      const user = await UserService.fetchUser(req.user.id);

      return res.status(200).json({
        message: "Fetch user successfully",
        data: user,
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default UserController;