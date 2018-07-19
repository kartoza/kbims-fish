# coding=utf-8

from django.conf.urls import url
from django.contrib.auth.decorators import login_required
from fish.api_views.fish_collection_record import (
    FishCollectionList,
    FishCollectionDetail,
)
from fish.views.csv_upload import CsvUploadView
from fish.views.shapefile_upload import \
    ShapefileUploadView, fish_process_shapefiles


api_urls = [
    url(r'^api/fish-collections/$', FishCollectionList.as_view()),
    url(r'^api/fish-collections/(?P<pk>[0-9]+)/$',
        FishCollectionDetail.as_view()),
    url(r'^fish/upload/$',
        login_required(CsvUploadView.as_view()),
        name='fish-csv-upload'),
    url(r'^fish/upload_shp/$',
        login_required(ShapefileUploadView.as_view()),
        name='fish-shapefile-upload'),
    url(r'^fish/process_shapefiles/$', fish_process_shapefiles,
        name='fish-process_shapefiles'),
]

urlpatterns = [
# Add custom URL paths here 

] + api_urls
