const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 启用CORS
app.use(cors());
app.use(express.json());

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

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'file-upload-service',
    timestamp: new Date().toISOString()
  });
});

// 文件上传接口
app.post('/upload', upload.single('file'), (req, res) => {
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

// 错误处理中间件
app.use((error, req, res, next) => {
  console.error('服务器错误:', error);
  res.status(500).json({
    success: false,
    message: error.message || '服务器内部错误'
  });
});

app.listen(PORT, () => {
  console.log(`📁 文件上传服务已启动，端口: ${PORT}`);
  console.log(`🔗 健康检查: http://localhost:${PORT}/health`);
  console.log(`📤 文件上传: http://localhost:${PORT}/upload`);
}); 