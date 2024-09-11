import json

def create_response(status, body, role=None):
    if (role is not None):
        return { 
            'statusCode': status, 
            'headers': {
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({
                'body': body,
                'role': role
            }, default=str)
        }
    return { 
            'statusCode': status, 
            'headers': {
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps(body, default=str)
        }
    
