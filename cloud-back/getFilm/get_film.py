import json
import boto3

from boto3.dynamodb.conditions import Key
from utility.utils import create_response

dynamodb = boto3.resource('dynamodb')
table_name = 'films-table'

def get(event, context):
    filename = event.get('queryStringParameters', {}).get('filename')
    print(filename)
    table = dynamodb.Table(table_name)
    response = table.query(
        KeyConditionExpression=Key('filename').eq(filename)
    )
    body = {
        'data': response['Items']
    }
    print(body)
    return create_response(200, body)
