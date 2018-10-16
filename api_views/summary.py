# coding=utf-8
import json
from django.db.models import Count
from fish.models.fish_collection_record import FishCollectionRecord
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer


class FishSummary(APIView):

    def get(self, request, *args):
        category = 'category'
        fish_summary = \
            FishCollectionRecord.objects.values(
                category).annotate(total=Count(category))

        response = JSONRenderer().render(fish_summary)
        response = json.loads(response)
        response.append({
            'total_fish': FishCollectionRecord.objects.all().count()
        })

        return Response(response)
