import boto3
from utility.utils import create_response

# Initialize DynamoDB and SNS clients
dynamodb = boto3.resource('dynamodb')
sns_client = boto3.client('sns')
table_name = 'favourites-table'

def get_all(event, context):
    
    userEmail = event.get('queryStringParameters', {}).get('userEmail')

    def get_all_subscriptions():
        subscriptions = []
        next_token = None

        while True:
            # Retrieve the list of subscriptions, handling pagination
            if next_token:
                response = sns_client.list_subscriptions(NextToken=next_token)
            else:
                response = sns_client.list_subscriptions()

            subscriptions.extend(response['Subscriptions'])

            # Check if there's a next page of results
            next_token = response.get('NextToken')
            if not next_token:
                break
        
        return subscriptions

    def get_topics_for_user(user_email):
        """Get all topics that the user (email) is subscribed to and are not pending confirmation."""
        subscriptions = get_all_subscriptions()
        
        # List to hold topic ARNs the user is subscribed to
        user_topics = []

        # Filter subscriptions by user email and check if the subscription is not pending confirmation
        for subscription in subscriptions:
            if subscription['Endpoint'] == user_email:
                subscription_arn = subscription['SubscriptionArn']
                
                # Add the topic only if not pending confirmation
                if subscription_arn != 'PendingConfirmation':
                    user_topics.append(subscription['TopicArn'])

        return user_topics
    
    def extract_topic_names(topic_arns):
        """Extract topic names from list of topic ARNs."""
        topic_names = [arn.split(':')[-1] for arn in topic_arns]
        return topic_names

    # Get topics the user is subscribed to and not pending confirmation
    user_subscribed_topics = get_topics_for_user(userEmail)
    topic_names = extract_topic_names(user_subscribed_topics)
    
    # Create the response body
    body = {
        "data": topic_names
    }
    
    return create_response(200, body)
