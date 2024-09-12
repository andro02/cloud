import json
import boto3

from boto3.dynamodb.conditions import Attr
from botocore.exceptions import ClientError
from utility.utils import create_response
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table_name = 'films-table'
favourites_table_name = 'favourites-table'
notifications_table_name = 'notifications-table'
counter_table_name = 'counter-table'

def update(event, context):
    body = json.loads(event['body'])
    table = dynamodb.Table(table_name)
    
    filename = event["queryStringParameters"]['filename']

    response = table.put_item(
        Item={
            'filename': body['filename'],
            'type': body['type'],
            'size': body['size'],
            'lastModifiedDate': body['lastModifiedDate'],
            'creationDate': body['lastModifiedDate'],
            'name': body['name'],
            'description': body['description'],
            'director': body['director'],
            'genre': body['genre'],
            'actors': body['actors'],
            'releaseDate': body['releaseDate'],
        }
    )

    body = {
        'message': 'Successfully updated film'
    }

    return create_response(200, body)
