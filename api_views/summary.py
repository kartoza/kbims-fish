# coding=utf-8
import json
from django.db.models import Count
from fish.models.fish_collection_record import FishCollectionRecord
from rest_framework.response import Response
from rest_framework.views import APIView


class FishSummary(APIView):

    def get(self, request, *args):
        category = 'category'
        fish_summary = \
            FishCollectionRecord.objects.values(
                category).annotate(total=Count(category))

        response = {}

        for summary in fish_summary:
            class_name = summary[category]
            if not class_name:
                continue
            if class_name not in response:
                response[class_name] = 0

            response[class_name] += summary['total']

        response['total_fish'] = FishCollectionRecord.objects.all().count()

        return Response(response)
