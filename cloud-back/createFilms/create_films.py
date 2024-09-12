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

def create(event, context):
    body = json.loads(event['body'])
    table = dynamodb.Table(table_name)

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

    favouritesTable = dynamodb.Table(favourites_table_name)

    names_to_match = [] 

    actors = body['actors'].split(',')
    for actor in actors:
        names_to_match.append(actor.strip())

    genres = body['genre'].split(',')
    for genre in genres:
        names_to_match.append(genre.strip())
    names_to_match.append(body['director'])
    
    filter_expression = Attr('name').is_in(names_to_match)

    response = favouritesTable.scan(
        FilterExpression=filter_expression,
        ProjectionExpression='#n, userEmail',
        ExpressionAttributeNames={
            '#n': 'name'
        }
    )

    matched_items = []
    for item in response['Items']:
        matched_name = item.get('name')
        matched_values = [name for name in names_to_match if name == matched_name]
        
        matched_items.append({
            'userEmail': item['userEmail'],
            'matchedNames': matched_values
        })

    for matched_item in matched_items:
        user_email = matched_item['userEmail']
        matched_names = matched_item['matchedNames']

        counter_table = dynamodb.Table(counter_table_name)

        try:
            counter_response = counter_table.update_item(
                Key={'counterName': notifications_table_name},
                UpdateExpression="SET currentValue = currentValue + :increment",
                ExpressionAttributeValues={':increment': 1},
                ReturnValues="UPDATED_NEW",
                ConditionExpression="attribute_exists(counterName)"
            )
        except ClientError as e:
            if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
                counter_table.put_item(
                    Item={
                        'counterName': notifications_table_name,
                        'currentValue': 1
                    }
                )
                new_id = 1
            else:
                raise
        else:
            new_id = counter_response['Attributes']['currentValue']

        notification_table = dynamodb.Table(notifications_table_name)

        now = datetime.now()
        current_time = now.strftime("%d-%m-%Y %H:%M")

        response = notification_table.put_item(
        Item={
            'id': new_id,
            'userEmail': user_email,
            'items': matched_names[0],
            'name': body['name'],
            'createdAt': current_time
        }
    )

    body = {
        'message': 'Successfully created film'
    }
    return create_response(200, body)


