from cognitojwt import jwt_sync

CLIENT_POOL = 'eu-central-1_ulN0PG00O'
CLIENT_POOL_CLIENT = '723a4agnkb2dkc5gh6jugbink4'
ADMIN_POOL = 'eu-central-1_vrLRXtUbL'
ADMIN_POOL_CLIENT = '5afcgqvifnkdv00637t72c25id'
REGION = 'eu-central-1'

def authorizer(event, context):
    token = event['identitySource'][0].split(' ')[1]

    try:
        decoded = jwt_sync.decode(token, REGION, CLIENT_POOL, app_client_id=CLIENT_POOL_CLIENT)
        principalId = decoded['sub']
        policyDocument = {
            'Version': '2012-10-17',
            'Statement': [{
                'Action': 'execute-api:Invoke',
                'Effect': 'Allow',
                'Resource': event['routeArn']
            }]
        }
    except Exception as e:
        print(e)
        try: 
            decoded = jwt_sync.decode(token, REGION, ADMIN_POOL, app_client_id=ADMIN_POOL_CLIENT)
            principalId = decoded['sub']
            policyDocument = {
                'Version': '2012-10-17',
                'Statement': [{
                    'Action': 'execute-api:Invoke',
                    'Effect': 'Allow',
                    'Resource': event['routeArn']
                }]
            }
        except Exception as e:
            print(e)
            principalId = 'unauthorized'
            policyDocument = {
                'Version': '2012-10-17',
                'Statement': [{
                    'Action': 'execute-api:Invoke',
                    'Effect': 'Deny',
                    'Resource': event['routeArn']
                }]
            }
    return {
        'principalId': principalId,
        'policyDocument': policyDocument
    }