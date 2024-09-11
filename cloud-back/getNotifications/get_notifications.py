import json
import boto3

from boto3.dynamodb.conditions import Attr
from utility.utils import create_response

dynamodb = boto3.resource('dynamodb')
table_name = 'notifications-table'

def get_all(event, context):
    userEmail = event.get('queryStringParameters', {}).get('userEmail')
    table = dynamodb.Table(table_name)
    response = table.scan(
        FilterExpression=Attr('userEmail').eq(userEmail)
    )
    body = {
        'data': response['Items']
    }
    return create_response(200, body)
