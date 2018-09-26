# coding=utf-8
import csv
from django.http import HttpResponse
from bims.models.location_site import LocationSite
from fish.models.fish_collection_record import FishCollectionRecord


def download_csv_site_detailed_dashboard(request, pk_site):
    fish_collection = FishCollectionRecord.objects.filter(site=pk_site)
    location_site = LocationSite.objects.get(pk=pk_site)
    fields = [f.name for f in FishCollectionRecord._meta.get_fields()]
    fields.remove('ready_for_validation')
    fields.remove('validated')
    # Create the HttpResponse object with the appropriate CSV header.
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = \
        'attachment; filename="'+ location_site.name +'.csv"'

    writer = csv.writer(response)
    writer.writerow(['Location site name', location_site.name])
    writer.writerow(['Total records', len(fish_collection)])
    writer.writerow([''])
    writer.writerow(fields)

    for fish in fish_collection:
        row_object = []
        for field in fields:
            row_object.append(getattr(fish, field))
        writer.writerow(row_object)

    return response
