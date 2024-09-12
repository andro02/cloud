import json
import boto3

from botocore.exceptions import ClientError
from utility.utils import create_response

dynamodb = boto3.resource('dynamodb')
table_name = 'ratings-table'
counter_table_name = 'counter-table'

def create(event, context):
    body = json.loads(event['body'])
    table = dynamodb.Table(table_name)
    counter_table = dynamodb.Table(counter_table_name)

    try:
        counter_response = counter_table.update_item(
            Key={'counterName': table_name},
            UpdateExpression="SET currentValue = currentValue + :increment",
            ExpressionAttributeValues={':increment': 1},
            ReturnValues="UPDATED_NEW",
            ConditionExpression="attribute_exists(counterName)"
        )
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            counter_table.put_item(
                Item={
                    'counterName': table_name,
                    'currentValue': 1
                }
            )
            new_id = 1
        else:
            raise
    else:
        new_id = counter_response['Attributes']['currentValue']

    response = table.put_item(
        Item={
            'id': new_id,
            'userEmail': body['userEmail'],
            'filename': body['filename'],
            'rating': body['rating']
        }
    )

    body = {
        'message': 'Successfully created rating'
    }
    return create_response(200, body)
