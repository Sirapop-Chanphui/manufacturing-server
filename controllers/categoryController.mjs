import CategoryService from "../service/categoryService.mjs";

const CategoryController = {
  create: async (req, res, next) => {
    try {
      const data = req.validatedBody || req.body;
      const category = await CategoryService.create(data);

      return res.status(201).json({
        message: "Category created successfully",
        data: category,
      });
    } catch (error) {
      return next(error);
    }
  },

  getAll: async (req, res, next) => {
    try {
      const categories = await CategoryService.getAll();

      return res.status(200).json(categories);
    } catch (error) {
      return next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const category = await CategoryService.getById(req.params.id);

      return res.status(200).json(category);
    } catch (error) {
      return next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const data = req.validatedBody || req.body;
      const category = await CategoryService.update(req.params.id, data);

      return res.status(200).json({
        message: "Category updated successfully",
        data: category,
      });
    } catch (error) {
      return next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      await CategoryService.delete(req.params.id);

      return res.status(200).json({
        message: "Category deleted successfully",
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default CategoryController;
