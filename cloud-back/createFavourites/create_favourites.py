import json
import boto3

from botocore.exceptions import ClientError
from utility.utils import create_response

dynamodb = boto3.resource('dynamodb')
table_name = 'favourites-table'
counter_table_name = 'counter-table'

def create(event, context):
    
    def get_topic_arn(sns_client, topic_name):
        response = sns_client.list_topics()
        topics = response.get('Topics', [])
        
        for topic in topics:
            topic_arn = topic['TopicArn']
            if topic_name in topic_arn:
                return topic_arn
        return None
    
    def create_topic(sns_client, topic_name):
        response = sns_client.create_topic(Name=topic_name)
        return response['TopicArn']
    
    def subscribe_user_to_topic(sns_client, topic_arn, protocol, endpoint):
        response = sns_client.subscribe(
            TopicArn=topic_arn,
            Protocol=protocol,
            Endpoint=endpoint
        )
        
        subscription_arn = response['SubscriptionArn']
        print(f"User subscribed with SubscriptionArn: {subscription_arn}")
        return subscription_arn

    body = json.loads(event['body'])
    # table = dynamodb.Table(table_name)
    # counter_table = dynamodb.Table(counter_table_name)

    # try:
    #     counter_response = counter_table.update_item(
    #         Key={'counterName': table_name},
    #         UpdateExpression="SET currentValue = currentValue + :increment",
    #         ExpressionAttributeValues={':increment': 1},
    #         ReturnValues="UPDATED_NEW",
    #         ConditionExpression="attribute_exists(counterName)"
    #     )
    # except ClientError as e:
    #     if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
    #         counter_table.put_item(
    #             Item={
    #                 'counterName': table_name,
    #                 'currentValue': 1
    #             }
    #         )
    #         new_id = 1
    #     else:
    #         raise
    # else:
    #     new_id = counter_response['Attributes']['currentValue']

    # response = table.put_item(
    #     Item={
    #         'id': new_id,
    #         'userEmail': body['userEmail'],
    #         'name': body['name']
    #     }
    # )
    sns_client = boto3.client('sns')
    topic_name = body['name']
    topic_name = topic_name.replace(" ", "_")

    topic_arn = get_topic_arn(sns_client, topic_name)
    
    if topic_arn:
        print(f"Topic already exists with ARN: {topic_arn}")
        protocol = 'email' 
        endpoint = body['userEmail']

        subscribe_user_to_topic(sns_client, topic_arn, protocol, endpoint)
    else:
        topic_arn = create_topic(sns_client, topic_name)
        print(f"Created new topic with ARN: {topic_arn}")
        protocol = 'email'  
        endpoint = body['userEmail']

        subscribe_user_to_topic(sns_client, topic_arn, protocol, endpoint)

    body = {
        'message': 'Successfully added to favourites'
    }
    return create_response(200, body)
