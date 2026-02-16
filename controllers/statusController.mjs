import StatusService from "../service/statusService.mjs";

const StatusController = {
  getAll: async (req, res, next) => {
    try {
      const statuses = await StatusService.getAll();

      return res.status(200).json(statuses);
    } catch (error) {
      return next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const status = await StatusService.getById(req.params.id);

      return res.status(200).json(status);
    } catch (error) {
      return next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const data = req.validatedBody || req.body;
      const updatedStatus = await StatusService.update(req.params.id, data);

      return res.status(200).json({
        message: "Status updated successfully",
        data: updatedStatus,
      });
    } catch (error) {
      return next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      await StatusService.delete(req.params.id);

      return res.status(200).json({
        message: "Status deleted successfully",
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default StatusController;
