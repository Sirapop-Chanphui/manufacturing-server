import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AuthRepository from "../repositories/authRepository.mjs";

const AuthService = {
  createUser: async (registerData) => {
    const { password, ...rest } = registerData;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await AuthRepository.createUser({
        ...rest,
        password: hashedPassword,
      });

      return user;
    } catch (error) {
      if (error.code === "23505") {
        const err = new Error("Validation error");
        err.statusCode = 400;
        err.fieldErrors = {
          email: "Email already exists",
        };
        throw err;

      }
      throw error;
    }
  },

  loginUser: async (loginData) => {
    const { email, password } = loginData;

    const user = await AuthRepository.findByEmail(email);

    if (!user) {
      const err = new Error("Invalid email or password");
      err.statusCode = 401;
      throw err;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const err = new Error("Invalid email or password");
      err.statusCode = 401;
      throw err;
    }

    const { password: _password, ...userWithoutPassword } = user;

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    return {
      token,
      user: userWithoutPassword,
    };
  },

  fetchUser: async (userId) => {
    const user = await AuthRepository.findById(userId);

    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    return user;
  },
};

export default AuthService;