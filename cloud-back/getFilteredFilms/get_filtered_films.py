import json
import boto3

from utility.utils import create_response

dynamodb = boto3.resource('dynamodb')
table_name = 'films-table'

def get(event, context):
    actor = event.get('queryStringParameters', {}).get('actor')
    description = event.get('queryStringParameters', {}).get('description')
    director = event.get('queryStringParameters', {}).get('director')
    genre = event.get('queryStringParameters', {}).get('genre')
    name = event.get('queryStringParameters', {}).get('name')

    filter_expression = []
    expression_attribute_values = {}
    expression_attribute_names = {}

    table = dynamodb.Table(table_name)

    if len(actor) != 0:
        filter_expression.append("contains(actors, :actor)")
        expression_attribute_values[":actor"] = actor
    if len(description) != 0:
        filter_expression.append("contains(description, :description)")
        expression_attribute_values[":description"] = description
    if len(director) != 0:
        filter_expression.append("contains(director, :director)")
        expression_attribute_values[":director"] = director
    if len(genre) != 0:
        filter_expression.append("contains(genre, :genre)")
        expression_attribute_values[":genre"] = genre
    if len(name) != 0:
        filter_expression.append("contains(#name_field, :name)")
        expression_attribute_values[":name"] = name
        expression_attribute_names["#name_field"] = "name"

    filter_expression = " AND ".join(filter_expression)

    if filter_expression:
        scan_params = {
            "FilterExpression": filter_expression,
            "ExpressionAttributeValues": expression_attribute_values,
        }
        if expression_attribute_names:
            scan_params["ExpressionAttributeNames"] = expression_attribute_names
        response = table.scan(**scan_params)
    else:
        response = table.scan()
        
    body = {
        'data': response['Items']
    }
    return create_response(200, body)
