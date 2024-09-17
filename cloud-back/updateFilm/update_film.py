import json
import boto3
import base64
import mimetypes

from boto3.dynamodb.conditions import Attr
from botocore.exceptions import ClientError
from utility.utils import create_response
from datetime import datetime

s3 = boto3.client("s3")
dynamodb = boto3.resource('dynamodb')
table_name = 'films-table'
favourites_table_name = 'favourites-table'
notifications_table_name = 'notifications-table'
counter_table_name = 'counter-table'

def update(event, context):
    table = dynamodb.Table(table_name)
    
    filename = event["queryStringParameters"]['filename']
    type = event["queryStringParameters"]['type']
    size = event["queryStringParameters"]['size']
    lastModifiedDate = event["queryStringParameters"]['lastModifiedDate']
    name = event["queryStringParameters"]['name']
    description = event["queryStringParameters"]['description']
    director = event["queryStringParameters"]['director']
    genre = event["queryStringParameters"]['genre']
    actors = event["queryStringParameters"]['actors']
    releaseDate = event["queryStringParameters"]['releaseDate']

    response = table.put_item(
        Item={
            'filename': filename,
            'type': type,
            'size': size,
            'lastModifiedDate': lastModifiedDate,
            'creationDate': lastModifiedDate,
            'name': name,
            'description': description,
            'director': director,
            'genre': genre,
            'actors': actors,
            'releaseDate': releaseDate,
        }
    )

    mimetypes.add_type('video/x-matroska', '.mkv')
    file_base64 = event['body']
    filename = event["queryStringParameters"]['filename']
    decoded_content = base64.b64decode(file_base64)
    mime_type, _ = mimetypes.guess_type(filename)

    if mime_type and mime_type.startswith('video/'):
        s3_upload = s3.put_object(Bucket="film-bucket",Key=filename,Body=decoded_content)

        body = {
            'message': 'Successfully updated film'
        }

        return create_response(200, body)
    else:
        return { 
            'statusCode': 400, 
            'headers': {},
            'body': json.dumps({'error': 'The uploaded file is not a video'}, default=str)
        }
