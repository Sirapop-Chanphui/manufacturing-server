import AuthService from "../service/authService.mjs";

const AuthController = {
  register: async (req, res, next) => {
    try {
      const user = await AuthService.createUser(req.body);

      return res.status(201).json({
        message: "User created successfully",
        data: user,
      });
    } catch (error) {
      return next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const result = await AuthService.loginUser(req.body);

      return res.status(200).json({
        message: "Login successfully",
        token: result.token,
        user: result.user,
      });
    } catch (error) {
      return next(error);
    }
  },

  fetchUser: async (req, res, next) => {
    try {
      const user = await AuthService.fetchUser(req.user.id);

      return res.status(200).json({
        message: "Fetch user successfully",
        data: user,
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default AuthController;


