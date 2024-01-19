#pip install boto3
import boto3

# Replace 'YOUR_ACCESS_KEY', 'YOUR_SECRET_KEY' and 'YOUR_SESSION_TOKEN' with your AWS access key, secret key and Session token
s3 = boto3.client('s3', aws_access_key_id='YOUR_ACCESS_KEY', aws_secret_access_key='YOUR_SECRET_KEY',aws_session_token='YOUR_SESSION_TOKEN')

# Replace 'your_bucket_name' with the name of your S3 bucket, Bucket name :ip-camera-storage
bucket_name = 'your_bucket_name'

# Replace 'your_file_key' with the desired key for the uploaded file in the bucket
file_key = 'your_file_key'

# Replace 'local_file_path' with the path to the file you want to upload
local_file_path = 'local_file_path'

# Upload the file
s3.upload_file(local_file_path, bucket_name, file_key)
