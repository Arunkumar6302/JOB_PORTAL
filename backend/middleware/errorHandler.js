// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  const status = err.status || 500;
  const message = err.message || 'Server error';
  
  res.status(status).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};

module.exports = errorHandler;
