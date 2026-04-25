import StatusRepository from "../repositories/statusRepository.mjs";

const StatusService = {
  getAll: async () => {
    return await StatusRepository.findAll();
  },

  getById: async (id) => {
    const status = await StatusRepository.findById(id);

    if (!status) {
      const err = new Error("Status not found");
      err.statusCode = 404;
      throw err;
    }

    return status;
  },

  update: async (id, data) => {
    const status = await StatusRepository.update(id, data);

    if (!status) {
      const err = new Error("Status not found");
      err.statusCode = 404;
      throw err;
    }

    return status;
  },

  delete: async (id) => {
    const status = await StatusRepository.delete(id);

    if (!status) {
      const err = new Error("Status not found");
      err.statusCode = 404;
      throw err;
    }

    return status;
  },
};

export default StatusService;
