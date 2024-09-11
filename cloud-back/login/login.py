import json
import boto3
import os
import botocore

from utility.utils import create_response

cognito = boto3.client('cognito-idp')
CLIENT_POOL = os.environ['CLIENT_POOL']
CLIENT_POOL_CLIENT = os.environ['CLIENT_POOL_CLIENT']
ADMIN_POOL = os.environ['ADMIN_POOL']
ADMIN_POOL_CLIENT = os.environ['ADMIN_POOL_CLIENT']

def login(event, context):
    print(CLIENT_POOL)
    print(ADMIN_POOL)
    body = json.loads(event['body'])
    email = body['email']
    password = body['password']

    try:
        response = cognito.admin_initiate_auth(
            AuthFlow = 'ADMIN_NO_SRP_AUTH',
            UserPoolId = CLIENT_POOL,
            ClientId = CLIENT_POOL_CLIENT,
            AuthParameters = {
                'USERNAME': email,
                'PASSWORD': password
            }
        )

        return create_response(200, response['AuthenticationResult'])
    
    except cognito.exceptions.UserNotFoundException:

        try:
            response = cognito.admin_initiate_auth(
                AuthFlow = 'ADMIN_NO_SRP_AUTH',
                UserPoolId = ADMIN_POOL,
                ClientId = ADMIN_POOL_CLIENT,
                AuthParameters = {
                    'USERNAME': email,
                    'PASSWORD': password
                }
            )

            return create_response(200, response['AuthenticationResult'])
    
        except cognito.exceptions.UserNotFoundException:

            return create_response(404, {'message': 'User not found'})