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

  updateProfile: async (req, res, next) => {
    try {
      const profileData = req.validatedBody || req.body;
      const file = req.files?.imageFile?.[0] || null;

      const user = await UserService.updateProfile(req.user.id, profileData, file);

      return res.status(200).json({
        message: "Profile updated successfully",
        data: user,
      });
    } catch (error) {
      return next(error);
    }
  },

  updatePassword: async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.validatedBody || req.body;

      await UserService.updatePassword(req.user.id, {
        currentPassword,
        newPassword,
      });

      return res.status(200).json({
        message: "Password updated successfully",
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default UserController;