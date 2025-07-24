module.exports = (req, res) => {
  res.json({
    status: 'ok',
    service: 'file-upload-service',
    timestamp: new Date().toISOString()
  });
}; 