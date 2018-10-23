# coding=utf-8
import json
from django.db.models import Count
from fish.models.fish_collection_record import FishCollectionRecord
from rest_framework.response import Response
from rest_framework.views import APIView


class FishSummary(APIView):
    """Returns fish summary"""

    def get(self, request, *args):
        category = 'category'
        fishes = FishCollectionRecord.objects.filter(validated=True)
        fish_summary = fishes.values(
                category).annotate(
                total=Count(category))

        response = {
            category: {}
        }

        for summary in fish_summary:
            category_name = summary[category]
            if not category_name:
                continue

            response[category][category_name] = summary['total']

        response['total_fish'] = fishes.count()
        response['total_fish_site'] = len(
                fishes.values_list('site').distinct())

        return Response(response)
