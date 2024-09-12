import base64
import boto3
import mimetypes
import json

from utility.utils import create_response

s3 = boto3.client("s3")

def upload(event, context):

    mimetypes.add_type('video/x-matroska', '.mkv')
    file_base64 = event['body']
    filename = event["queryStringParameters"]['filename']
    decoded_content = base64.b64decode(file_base64)
    mime_type, _ = mimetypes.guess_type(filename)

    if mime_type and mime_type.startswith('video/'):
        s3_upload = s3.put_object(Bucket="film-bucket",Key=filename,Body=decoded_content)

        return { 
            'statusCode': 200, 
            'headers': {},
            'body': json.dumps(file_base64, default=str)
        }
    else:
        return { 
            'statusCode': 400, 
            'headers': {},
            'body': json.dumps({'error': 'The uploaded file is not a video'}, default=str)
        }
    