## AWS S3 Setup for Media Uploads

Follow these steps to enable S3 storage for product images/videos.

### 1) Create the S3 bucket
- AWS Console → S3 → Create bucket
- Bucket name: globally unique (e.g., `your-app-product-media`)
- Region: pick close to users (e.g., `us-east-1`)
- Block Public Access: uncheck “Block all public access” (images must be public)
- Versioning: optional; disable to save cost
- Create bucket

### 2) Bucket policy (public read for objects)
In **Permissions → Bucket policy**, use (replace `YOUR-BUCKET-NAME`):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

### 3) (Optional) CORS if browser uploads directly
In **Permissions → CORS**:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### 4) Create IAM user with least privilege
- AWS Console → IAM → Users → Create user
- Access type: Programmatic access
- Attach custom policy (replace `YOUR-BUCKET-NAME`):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR-BUCKET-NAME",
        "arn:aws:s3:::YOUR-BUCKET-NAME/*"
      ]
    }
  ]
}
```
- Name it (e.g.) `EcommerceS3UploadPolicy`
- Finish user creation and download the Access key ID and Secret access key

### 5) Configure environment variables
Copy `backend/env.example` to `.env` and set:
```
USE_AWS_S3=true
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<from IAM>
AWS_SECRET_ACCESS_KEY=<from IAM>
AWS_S3_BUCKET_NAME=<your bucket>
AWS_S3_BUCKET_URL=https://<bucket>.s3.<region>.amazonaws.com   # optional; use CDN if available
```

### 6) Test
- Restart backend so env vars load.
- Upload an image via admin route; confirm it appears in S3.
- Open the image URL in browser; it should be publicly accessible.
- Delete the image via API; confirm it is removed from S3 and DB.

### Notes
- Keep access keys out of git; rotate regularly.
- Prefer IAM roles when deploying on AWS compute (EC2/ECS).
- Consider CloudFront for CDN and caching.

