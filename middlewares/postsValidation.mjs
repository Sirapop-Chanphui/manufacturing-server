const postsValidation = (req, res, next) => {
    const {
      title,
      image,
      category_id,
      description,
      content,
      status_id,
    } = req.body;
  
    const missingFields = [];
  
    if (!title) missingFields.push("title");
    if (!image) missingFields.push("image");
    if (!category_id) missingFields.push("category_id");
    if (!description) missingFields.push("description");
    if (!content) missingFields.push("content");
    if (!status_id) missingFields.push("status_id");
  
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields,
      });
    }
  
    next();
  };
  
  export default postsValidation;
  