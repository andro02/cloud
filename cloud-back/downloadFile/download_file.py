import base64
import boto3

from utility.utils import create_response

s3 = boto3.client("s3")

def download(event, context):

    filename = event['queryStringParameters']['filename']
    response = s3.get_object(Bucket='film-bucket', Key=filename)
    file_data = base64.b64encode(response["Body"].read()).decode()

    return {
        'statusCode': 200,
        'body': file_data,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': response['ContentType'],
            'Content-Disposition': f'attachment; filename={filename}'
        }
    }