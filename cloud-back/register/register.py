import json
import boto3
import os

from utility.utils import create_response

cognito = boto3.client('cognito-idp')
CLIENT_POOL = os.environ['CLIENT_POOL']
CLIENT_POOL_CLIENT = os.environ['CLIENT_POOL_CLIENT']
ADMIN_POOL = os.environ['ADMIN_POOL']
ADMIN_POOL_CLIENT = os.environ['ADMIN_POOL_CLIENT']

def register(event, context):
    body = json.loads(event['body'])

    name = body['name']
    surname = body['surname']
    username = body['username']
    email = body['email']
    birthday = body['birthday']
    password = body['password']

    response = cognito.list_users(
        UserPoolId = CLIENT_POOL,
        AttributesToGet = [
            'email'
        ],
        Filter = "email = \"" + str(email) + "\""
    )

    if len(response['Users']) != 0:

        response = cognito.list_users(
            UserPoolId = ADMIN_POOL,
            AttributesToGet = [
                'email'
            ],
            Filter = "email = \"" + str(email) + "\""
        )

        if len(response['Users']) != 0:
            body = {
            'message': 'User with that email already exists'
            }
            return create_response(400, body)


    response = cognito.list_users(
        UserPoolId = CLIENT_POOL,
        AttributesToGet = [
            'nickname',
        ],
    )

    for user in response['Users']:
        for attribute in user['Attributes']:
            if attribute['Name'] == 'nickname' and attribute['Value'] == username:
                body = {
                    'message': 'User with that username already exists'
                }
                return create_response(400, body)
            
    response = cognito.list_users(
        UserPoolId = ADMIN_POOL,
        AttributesToGet = [
            'nickname',
        ],
    )

    for user in response['Users']:
        for attribute in user['Attributes']:
            if attribute['Name'] == 'nickname' and attribute['Value'] == username:
                body = {
                    'message': 'User with that username already exists'
                }
                return create_response(400, body)

    response = cognito.admin_create_user(
        UserPoolId = CLIENT_POOL,
        Username = email,
        UserAttributes=[
            {
                'Name': "email",
                'Value': email
            },
            {
                'Name': "email_verified",
                'Value': "true"
            },
            {
                'Name': "given_name",
                'Value': name
            },
            {
                'Name': "family_name",
                'Value': surname
            },
            {
                'Name': "nickname",
                'Value': username
            },
            {
                'Name': "birthdate",
                'Value': birthday
            },
        ],
        MessageAction = 'SUPPRESS'
    )
    
    if response['User']:
        cognito.admin_set_user_password(
            Password = password,
            UserPoolId = CLIENT_POOL,
            Username = email,
            Permanent = True
        )
    
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
