import xmltodict
import json

def convert_xml_to_json(xml_string: str) -> dict:
    parsed_dict = xmltodict.parse(xml_string)
    return json.loads(json.dumps(parsed_dict))  # clean conversion