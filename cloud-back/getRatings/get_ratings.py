import json
import boto3

from boto3.dynamodb.conditions import Attr
from utility.utils import create_response

dynamodb = boto3.resource('dynamodb')
table_name = 'ratings-table'

def get_all(event, context):
    filename = event.get('queryStringParameters', {}).get('filename')
    table = dynamodb.Table(table_name)
    response = table.scan(
        FilterExpression=Attr('filename').eq(filename)
    )
    body = {
        'data': response['Items']
    }
    return create_response(200, body)
