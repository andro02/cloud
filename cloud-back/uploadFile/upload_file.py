import base64
import boto3
import json

from utility.utils import create_response

s3 = boto3.client("s3")

def upload(event, context):

    file_base64 = event['body']
    #return create_response(200, event)
    filename = event["queryStringParameters"]['filename']
    decoded_content = base64.b64decode(file_base64)
    s3_upload = s3.put_object(Bucket="film-bucket",Key=filename,Body=decoded_content)

    return { 
        'statusCode': 200, 
        'headers': {},
        'body': json.dumps(file_base64, default=str)
    }
    