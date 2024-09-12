import json
import boto3

from utility.utils import create_response

dynamodb = boto3.resource('dynamodb')
table_name = 'favourites-table'


def delete(event, context):

    body = json.loads(event['body'])
    table = dynamodb.Table(table_name)
    
    query_params = event.get('queryStringParameters', {})
    id = int(query_params.get('id'))
    print(id)

    response = table.delete_item(
        Key={
            'id': id
        }
    )
    
    if response.get('ResponseMetadata', {}).get('HTTPStatusCode') == 200:
            body = {
                'message': 'Successfully removed from favourites'
            }
            return create_response(200, body)
    else:
        body = {
            'message': 'Failed to remove from favourites'
        }
        return create_response(400, body)