# 文件上传服务

简单的文件上传服务，用于获取PDF文件的在线URL。

## 功能

- 支持PDF文件上传
- 返回Base64编码的文件内容
- 适合Vercel无服务器环境部署

## 部署到Vercel

1. 将代码推送到GitHub仓库
2. 在Vercel中导入项目
3. 自动部署

## API接口

### 文件上传
- **URL**: `POST /upload`
- **参数**: `file` (PDF文件)
- **返回**: 
```json
{
  "success": true,
  "data": {
    "fileName": "文件名.pdf",
    "fileUrl": "data:application/pdf;base64,...",
    "fileSize": 12345,
    "uploadTime": "2025-07-24T..."
  }
}
```

### 健康检查
- **URL**: `GET /health`
- **返回**: 
```json
{
  "status": "ok",
  "service": "file-upload-service",
  "timestamp": "2025-07-24T..."
}
```

## 使用说明

1. 部署后获得Vercel域名
2. 在小程序配置文件中更新 `uploadUrl`
3. 在微信公众平台添加域名到 `uploadFile合法域名` 