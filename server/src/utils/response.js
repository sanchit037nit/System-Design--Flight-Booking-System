function successResponse(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data
  });
}

function errorResponse(
  res,
  statusCode,
  code,
  message,
  details
) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details && { details })
    }
  });
}

module.exports = {
  successResponse,
  errorResponse
};