import base64
import boto3
import json

from utility.utils import create_response


def deleteFile(event, context):
    s3 = boto3.client("s3")
    filename = event["queryStringParameters"]['filename']
    
    response = s3.delete_object(Bucket="film-bucket",Key=filename)
    
    body = {
        'message': 'Successfully deleted film'
    }
    return create_response(200, body)