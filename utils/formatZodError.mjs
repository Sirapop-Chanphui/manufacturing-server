const formatZodError = (zodError) => {
    const { formErrors, fieldErrors } = zodError.flatten();
  
    return {
      formErrors: formErrors[0] || null,
      fieldErrors: Object.fromEntries(
        Object.entries(fieldErrors).map(([key, value]) => [
          key,
          value[0],
        ])
      ),
    };
  };
  
  export default formatZodError;
  