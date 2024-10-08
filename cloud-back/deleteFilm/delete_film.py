import json
import boto3

from utility.utils import create_response

dynamodb = boto3.resource('dynamodb')
table_name = 'films-table'
counter_table_name = 'counter-table'


def delete(event, context):

    body = json.loads(event['body'])
    table = dynamodb.Table(table_name)
    
    filename = event.get('queryStringParameters', {}).get('filename')

    response = table.delete_item(
        Key={
            'filename': filename
        }
    )
    
    if response.get('ResponseMetadata', {}).get('HTTPStatusCode') == 200:
            
        s3 = boto3.client("s3")
        
        response = s3.delete_object(Bucket="film-bucket",Key=filename)
        body = {
            'message': 'Successfully deleted film'
        }
        return create_response(200, body)
    else:
        body = {
            'message': 'Failed to delete film'
        }
        return create_response(400, body)