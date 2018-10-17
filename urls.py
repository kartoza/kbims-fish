# coding=utf-8

from django.conf.urls import url
from django.contrib.auth.decorators import login_required
from fish.api_views.fish_collection_record import (
    FishCollectionList,
    FishCollectionDetail,
    FishCollectionSite,
)
from fish.api_views.summary import FishSummary
from fish.views.csv_upload import CsvUploadView
from fish.views.shapefile_upload import \
    ShapefileUploadView, fish_process_shapefiles
from fish.views.download_csv_site_dashboard import \
    download_csv_site_detailed_dashboard


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
    url(r'api/fish-collections-site/$',
        FishCollectionSite.as_view()),
    url(r'^fish/download-csv-site/$',
        download_csv_site_detailed_dashboard,
        name='fish-site-download'),
    url(r'^api/fish-summary/$', FishSummary.as_view()),
]

urlpatterns = api_urls
