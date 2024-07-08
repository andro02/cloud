import json
import boto3
import os
import botocore

from utility.utils import create_response

cognito = boto3.client('cognito-idp')
USER_POOL = os.environ['USER_POOL']
USER_POOL_CLIENT = os.environ['USER_POOL_CLIENT']

def login(event, context):
    body = json.loads(event['body'])
    email = body['email']
    password = body['password']

    try:
        response = cognito.admin_initiate_auth(
            AuthFlow = 'ADMIN_NO_SRP_AUTH',
            UserPoolId = USER_POOL,
            ClientId = USER_POOL_CLIENT,
            AuthParameters = {
                'USERNAME': email,
                'PASSWORD': password
            }
        )

        return create_response(200, response['AuthenticationResult'])
    
    except cognito.exceptions.UserNotFoundException:
        return create_response(404, {'message': 'User not found'})