import json
import boto3

from boto3.dynamodb.conditions import Key
from utility.utils import create_response

dynamodb = boto3.resource('dynamodb')
table_name = 'films-table'

def get(event, context):
    # actor = event.get('queryStringParameters', {}).get('actor')
    # description = event.get('queryStringParameters', {}).get('description')
    # director = event.get('queryStringParameters', {}).get('director')
    # genre = event.get('queryStringParameters', {}).get('genre')
    # name = event.get('queryStringParameters', {}).get('name')

    # filter_expression = []
    # expression_attribute_values = {}
    # expression_attribute_names = {}

    # table = dynamodb.Table(table_name)

    # if len(actor) != 0:
    #     filter_expression.append("contains(actors, :actor)")
    #     expression_attribute_values[":actor"] = actor
    # if len(description) != 0:
    #     filter_expression.append("contains(description, :description)")
    #     expression_attribute_values[":description"] = description
    # if len(director) != 0:
    #     filter_expression.append("contains(director, :director)")
    #     expression_attribute_values[":director"] = director
    # if len(genre) != 0:
    #     filter_expression.append("contains(genre, :genre)")
    #     expression_attribute_values[":genre"] = genre
    # if len(name) != 0:
    #     filter_expression.append("contains(#name_field, :name)")
    #     expression_attribute_values[":name"] = name
    #     expression_attribute_names["#name_field"] = "name"

    # filter_expression = " AND ".join(filter_expression)

    # if filter_expression:
    #     scan_params = {
    #         "FilterExpression": filter_expression,
    #         "ExpressionAttributeValues": expression_attribute_values,
    #     }
    #     if expression_attribute_names:
    #         scan_params["ExpressionAttributeNames"] = expression_attribute_names
    #     response = table.scan(**scan_params)
    # else:
    #     response = table.scan()
        
    # body = {
    #     'data': response['Items']
    # }

    table = dynamodb.Table(table_name)

    actor = event.get('queryStringParameters', {}).get('actor')
    description = event.get('queryStringParameters', {}).get('description')
    director = event.get('queryStringParameters', {}).get('director')
    genre = event.get('queryStringParameters', {}).get('genre')
    name = event.get('queryStringParameters', {}).get('name')

    def query_by_index_with_begins(index_name, key_name, value):
        if value and value.strip(): 
            response = table.query(
                IndexName=index_name,
                KeyConditionExpression=Key(key_name).eq(value)
            )
            return response['Items']
        return []
    
    def get_all_items():
        response = table.scan()
        return response['Items']

    query_results = []

    if actor:
        query_results.append(query_by_index_with_begins('actors-index', 'actors', actor))
    if description:
        query_results.append(query_by_index_with_begins('description-index', 'description', description))
    if director:
        query_results.append(query_by_index_with_begins('director-index', 'director', director))
    if genre:
        query_results.append(query_by_index_with_begins('genre-index', 'genre', genre))
    if name:
        query_results.append(query_by_index_with_begins('name-index', 'name', name))

    def combine_results(*result_sets):
        if not result_sets:
            return []
        
        combined = set(map(lambda x: frozenset(x.items()), result_sets[0]))

        for result_set in result_sets[1:]:
            combined.intersection_update(map(lambda x: frozenset(x.items()), result_set))
        
        return [dict(item) for item in combined]

    if not any([actor, description, director, genre, name]): 
        final_results = get_all_items()
    else:
        final_results = combine_results(*query_results) if query_results else []

    return create_response(200, final_results)
