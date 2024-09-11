import boto3

from utility.utils import create_response

dynamodb = boto3.resource('dynamodb')
table_name = 'fvourites-table'

def get_all(event, context):
    print(event.queryStringParameters)
    table = dynamodb.Table(table_name)
    response = table.scan()
    body = {
        'data': response['Items']
    }
    return create_response(200, body)