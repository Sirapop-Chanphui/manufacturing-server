import CategoryRepository from "../repositories/categoryRepository.mjs";

const CategoryService = {
  create: async (data) => {
    return await CategoryRepository.create(data);
  },

  getAll: async () => {
    return await CategoryRepository.findAll();
  },

  getById: async (id) => {
    const category = await CategoryRepository.findById(id);

    if (!category) {
      const err = new Error("Category not found");
      err.statusCode = 404;
      throw err;
    }

    return category;
  },

  update: async (id, data) => {
    const category = await CategoryRepository.update(id, data);

    if (!category) {
      const err = new Error("Category not found");
      err.statusCode = 404;
      throw err;
    }

    return category;
  },

  delete: async (id) => {
    const category = await CategoryRepository.delete(id);

    if (!category) {
      const err = new Error("Category not found");
      err.statusCode = 404;
      throw err;
    }

    return category;
  },
};

export default CategoryService;
