import json
import boto3
import os

from utility.utils import create_response

cognito = boto3.client('cognito-idp')
USER_POOL = os.environ['USER_POOL']

def register(event, context):
    body = json.loads(event['body'])
    email = body['email']
    password = body['password']

    response = cognito.admin_create_user(
        UserPoolId = USER_POOL,
        Username = email,
        UserAttributes=[
            {
                'Name': "email",
                'Value': email
            }, {
                'Name': "email_verified",
                'Value': "true"
            },
        ],
        MessageAction = 'SUPPRESS'
    )
    
    if response['User']:
        cognito.admin_set_user_password(
            Password = password,
            UserPoolId = USER_POOL,
            Username = email,
            Permanent = True
        )

    body = {
        'message': 'Successfully registered user'
    }
    return create_response(200, body)
