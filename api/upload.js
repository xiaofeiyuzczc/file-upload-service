const multer = require('multer');

// 使用内存存储，适合Vercel无服务器环境
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // 只允许PDF文件
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('只允许上传PDF文件'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 限制10MB
  }
});

module.exports = (req, res) => {
  // 只处理POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: '只支持POST请求'
    });
  }

  // 使用multer处理文件上传
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: '没有上传文件'
        });
      }

      // 将文件内容转换为Base64
      const fileBuffer = req.file.buffer;
      const base64Content = fileBuffer.toString('base64');
      
      // 生成Data URL
      const dataUrl = `data:application/pdf;base64,${base64Content}`;
      
      res.json({
        success: true,
        data: {
          fileName: req.file.originalname,
          fileUrl: dataUrl,
          fileSize: req.file.size,
          uploadTime: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('文件上传错误:', error);
      res.status(500).json({
        success: false,
        message: '文件上传失败'
      });
    }
  });
}; 