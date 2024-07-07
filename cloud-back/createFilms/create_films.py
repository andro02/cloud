import json
import boto3

from utility.utils import create_response

dynamodb = boto3.resource('dynamodb')
table_name = 'films-table'

def create(event, context):
    body = json.loads(event['body'])
    table = dynamodb.Table(table_name)

    response = table.put_item(
        Item={
            'filename': body['filename'],
            'type': body['type'],
            'size': body['size'],
            'lastModifiedDate': body['lastModifiedDate'],
        }
    )

    body = {
        'message': 'Successfully created film'
    }
    return create_response(200, body)
