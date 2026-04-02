import bcrypt from "bcrypt";
import UserRepository from "../repositories/userRepository.mjs";
import supabase from "../utils/supabaseClient.mjs";
import { removeStorageObjectByPublicUrl } from "../utils/supabaseStorageHelpers.mjs";

const BUCKET_NAME = "manufacturing-blog";

const UserService = {

  fetchUser: async (userId) => {
    const user = await UserRepository.findById(userId);

    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    return user;
  },

  updateProfile: async (userId, { name, username, removeProfileImage }, file) => {
    if (file && removeProfileImage) {
      const err = new Error("Validation error");
      err.statusCode = 400;
      err.fieldErrors = {
        removeProfileImage:
          "Cannot remove profile image and upload a new file in the same request",
      };
      throw err;
    }

    const taken = await UserRepository.findByUsernameExcludingId(username, userId);
    if (taken) {
      const err = new Error("Validation error");
      err.statusCode = 400;
      err.fieldErrors = { username: "Username already taken" };
      throw err;
    }

    const existing = await UserRepository.findById(userId);
    if (!existing) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    let profilePicUrl = null;
    let profilePicMode = "keep";
    let previousProfilePicUrl = null;

    if (file) {
      previousProfilePicUrl = existing.profile_pic ?? null;
      profilePicMode = "set";

      const filePath = `profiles/${userId}_${Date.now()}_${file.originalname}`;

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

      profilePicUrl = publicUrl;
    } else if (removeProfileImage) {
      profilePicMode = "clear";
      previousProfilePicUrl = existing.profile_pic ?? null;
    }

    try {
      const updated = await UserRepository.updateProfile(userId, {
        name,
        username,
        profilePicUrl,
        profilePicMode,
      });

      if (!updated) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
      }

      if (file && previousProfilePicUrl) {
        await removeStorageObjectByPublicUrl(
          supabase,
          BUCKET_NAME,
          previousProfilePicUrl
        );
      }

      if (removeProfileImage && !file && previousProfilePicUrl) {
        await removeStorageObjectByPublicUrl(
          supabase,
          BUCKET_NAME,
          previousProfilePicUrl
        );
      }

      return updated;
    } catch (error) {
      if (error.code === "23505") {
        const err = new Error("Validation error");
        err.statusCode = 400;
        err.fieldErrors = { username: "Username already taken" };
        throw err;
      }
      throw error;
    }
  },

  updatePassword: async (userId, { currentPassword, newPassword }) => {
    const hash = await UserRepository.findPasswordHashById(userId);

    if (!hash) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    const isValid = await bcrypt.compare(currentPassword, hash);

    if (!isValid) {
      const err = new Error("Validation error");
      err.statusCode = 400;
      err.fieldErrors = { currentPassword: "Current password is incorrect" };
      throw err;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updated = await UserRepository.updatePassword(userId, hashedPassword);

    if (!updated) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    return updated;
  },
};

export default UserService;