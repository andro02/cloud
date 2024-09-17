import json
import boto3

from utility.utils import create_response

dynamodb = boto3.resource('dynamodb')
table_name = 'favourites-table'


def delete(event, context):

    sns_client = boto3.client('sns')

    def get_topic_arn_by_name(topic_name):
        """Get the Topic ARN by its name."""
        topics = []
        next_token = None

        while True:
            if next_token:
                response = sns_client.list_topics(NextToken=next_token)
            else:
                response = sns_client.list_topics()

            topics.extend(response['Topics'])

            next_token = response.get('NextToken')
            if not next_token:
                break
        
        for topic in topics:
            arn = topic['TopicArn']
            if arn.split(':')[-1] == topic_name:
                return arn
        
        return None

    def get_subscription_arn(user_email, topic_arn):
        """Get the Subscription ARN for a given user email and topic ARN."""
        subscriptions = []
        next_token = None

        while True:
            if next_token:
                response = sns_client.list_subscriptions_by_topic(TopicArn=topic_arn, NextToken=next_token)
            else:
                response = sns_client.list_subscriptions_by_topic(TopicArn=topic_arn)

            subscriptions.extend(response['Subscriptions'])

            next_token = response.get('NextToken')
            if not next_token:
                break
        
        for subscription in subscriptions:
            if subscription['Endpoint'] == user_email:
                return subscription['SubscriptionArn']
        
        return None

    def is_pending_confirmation(subscription_arn):
        """Check if the subscription is pending confirmation."""
        response = sns_client.get_subscription_attributes(SubscriptionArn=subscription_arn)
        return response['Attributes'].get('PendingConfirmation') == 'true'

    def unsubscribe_user(user_email, topic_name):
        """Unsubscribe a user from a topic by email and topic name."""
        topic_arn = get_topic_arn_by_name(topic_name)
        if not topic_arn:
            print(f"Topic '{topic_name}' not found.")
            return

        subscription_arn = get_subscription_arn(user_email, topic_arn)
        
        if not subscription_arn:
            print(f"Subscription for user '{user_email}' to topic '{topic_name}' not found.")
            return

        sns_client.unsubscribe(SubscriptionArn=subscription_arn)
        print(f"User '{user_email}' unsubscribed from topic '{topic_name}'.")
    
    userEmail = event.get('queryStringParameters', {}).get('userEmail')
    topicName = event.get('queryStringParameters', {}).get('topicName')

    unsubscribe_user(userEmail, topicName)