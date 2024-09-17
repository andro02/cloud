import json
import boto3
import mimetypes
import base64

from boto3.dynamodb.conditions import Attr
from botocore.exceptions import ClientError
from collections import defaultdict
from utility.utils import create_response
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
s3 = boto3.client("s3")
sns_client = boto3.client('sns')
table_name = 'films-table'
favourites_table_name = 'favourites-table'
notifications_table_name = 'notifications-table'
counter_table_name = 'counter-table'

def create(event, context):

    def send_email_to_subscribers(sns_client, topic_arn, subject, message):
        try:
            response = sns_client.publish(
                TopicArn=topic_arn,
                Message=message,
                Subject=subject 
            )
            print(f"Message sent! MessageId: {response['MessageId']}")
        except Exception as e:
            print(f"Failed to send message: {e}")

    filename = event["queryStringParameters"]['filename']
    type = event["queryStringParameters"]['type']
    size = event["queryStringParameters"]['size']
    lastModifiedDate = event["queryStringParameters"]['lastModifiedDate']
    name = event["queryStringParameters"]['name']
    description = event["queryStringParameters"]['description']
    director = event["queryStringParameters"]['director']
    genre = event["queryStringParameters"]['genre']
    actors = event["queryStringParameters"]['actors']
    releaseDate = event["queryStringParameters"]['releaseDate']
    userEmail = event["queryStringParameters"]['userEmail']
    table = dynamodb.Table(table_name)

    response = table.put_item(
        Item={
            'filename': filename,
            'type': type,
            'size': size,
            'lastModifiedDate': lastModifiedDate,
            'creationDate': lastModifiedDate,
            'name': name,
            'description': description,
            'director': director,
            'genre': genre,
            'actors': actors,
            'releaseDate': releaseDate,
        }
    )

    # favouritesTable = dynamodb.Table(favourites_table_name)

    names_to_match = [] 

    actors = actors.split(',')
    for actor in actors:
        names_to_match.append(actor.strip())

    genres = genre.split(',')
    for genre in genres:
        names_to_match.append(genre.strip())
    names_to_match.append(director)
    
    # filter_expression = Attr('name').is_in(names_to_match)

    # response = favouritesTable.scan(
    #     FilterExpression=filter_expression,
    #     ProjectionExpression='#n, userEmail',
    #     ExpressionAttributeNames={
    #         '#n': 'name'
    #     }
    # )

    # matched_items = []
    # for item in response['Items']:
    #     matched_name = item.get('name')
    #     matched_values = [name for name in names_to_match if name == matched_name]
        
    #     matched_items.append({
    #         'userEmail': item['userEmail'],
    #         'matchedNames': matched_values
    #     })

    
    def get_all_topics():
        """Retrieve all SNS topics."""
        topics = []
        next_token = None

        while True:
            # Retrieve the list of topics, handling pagination
            if next_token:
                response = sns_client.list_topics(NextToken=next_token)
            else:
                response = sns_client.list_topics()

            topics.extend(response['Topics'])

            # Check if there's a next page of results
            next_token = response.get('NextToken')
            if not next_token:
                break
        
        return topics

    def filter_topics_by_names(topics, names_to_match):
        """Filter topics by a list of names to match."""
        matched_topics = []
        names_to_match_set = set(names_to_match)  # Convert list to set for efficient lookup

        for topic in topics:
            topic_arn = topic['TopicArn']
            topic_name = topic_arn.split(':')[-1]  # Extract topic name from ARN
            
            if topic_name.replace('_', ' ') in names_to_match_set:
                matched_topics.append(topic_arn)
        
        return matched_topics

    # Get all topics
    all_topics = get_all_topics()

    # Filter topics by names
    matched_topics = filter_topics_by_names(all_topics, names_to_match)

    print("Matched Topics:")
    for topic in matched_topics:
        print(topic)

    for topic in matched_topics:

        subject = "New Movie Uploaded"
        message = "New " + topic.split(':')[-1].replace('_', ' ') + " movie named " + name +"!"
        print(message)
        send_email_to_subscribers(sns_client, topic, subject, message)

    # for matched_item in matched_items:
    #     user_email = matched_item['userEmail']
    #     matched_names = matched_item['matchedNames']

    #     counter_table = dynamodb.Table(counter_table_name)

    #     try:
    #         counter_response = counter_table.update_item(
    #             Key={'counterName': notifications_table_name},
    #             UpdateExpression="SET currentValue = currentValue + :increment",
    #             ExpressionAttributeValues={':increment': 1},
    #             ReturnValues="UPDATED_NEW",
    #             ConditionExpression="attribute_exists(counterName)"
    #         )
    #     except ClientError as e:
    #         if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
    #             counter_table.put_item(
    #                 Item={
    #                     'counterName': notifications_table_name,
    #                     'currentValue': 1
    #                 }
    #             )
    #             new_id = 1
    #         else:
    #             raise
    #     else:
    #         new_id = counter_response['Attributes']['currentValue']

    #     notification_table = dynamodb.Table(notifications_table_name)

    #     now = datetime.now()
    #     current_time = now.strftime("%d-%m-%Y %H:%M")

    #     response = notification_table.put_item(
    #     Item={
    #         'id': new_id,
    #         'userEmail': user_email,
    #         'items': matched_names[0],
    #         'name': name,
    #         'createdAt': current_time
    #     }
    # )
    
    #     # try:
    #     #     client = boto3.client("ses")
    #     #     subject = "New Movie Uploaded"
    #     #     text = "New " + matched_names[0] + " movie named " + name +"!"
    #     #     message = {"Subject": {"Data": subject}, "Body": {"Html": {"Data": text}}}
    #     #     client.send_email(Source = "andrija.slovic02@gmail.com", Destination = {"ToAddresses": [user_email]}, Message = message)
    #     # except:
    #     #     pass

    mimetypes.add_type('video/x-matroska', '.mkv')
    file_base64 = event['body']
    filename = event["queryStringParameters"]['filename']
    decoded_content = base64.b64decode(file_base64)
    mime_type, _ = mimetypes.guess_type(filename)

    if mime_type and mime_type.startswith('video/'):
        s3_upload = s3.put_object(Bucket="film-bucket",Key=filename,Body=decoded_content)

        returnBody = {
            'message': 'Successfully created film'
        }
        return create_response(200, returnBody)
        
    else:
        return { 
            'statusCode': 400, 
            'headers': {},
            'body': json.dumps({'error': 'The uploaded file is not a video'}, default=str)
        }


