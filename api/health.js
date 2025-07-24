export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    service: 'file-upload-service',
    timestamp: new Date().toISOString()
  });
} 