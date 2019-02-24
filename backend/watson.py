from watson_developer_cloud import ToneAnalyzerV3, WatsonApiException
import json

def analyze(txt):
    tone_analyzer = ToneAnalyzerV3(
        version='2017-09-21',
        iam_apikey='Hut8YMXOCyEnDFez6FyySdNc2cSWs2XqGQzp7_6gT6MN',
        url='https://gateway.watsonplatform.net/tone-analyzer/api'
    )

    try:
        tone_analysis = tone_analyzer.tone({'text': txt}, 'application/json', sentences=False).get_result()
        return tone_analysis['document_tone']['tones']
    except WatsonApiException as ex:
        print("Method failed with status code %s: %s") % (str(ex.code), ex.message)

if __name__ == "__main__":
    analyze("A comma-separated list of tones for which the service is to return its analysis of the input; the indicated tones apply both to the full document and to individual sentences of the document. You can specify one or more of the valid values. Omit the parameter to request results for all three tones.")