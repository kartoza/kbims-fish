# coding=utf-8
import csv
from django.http import HttpResponse
from bims.models.location_site import LocationSite
from fish.models.fish_collection_record import FishCollectionRecord
from bims.api_views.collection import GetCollectionAbstract


def download_csv_site_detailed_dashboard(request):
    site_id = request.GET.get('siteId')
    query_value = request.GET.get('search')
    filters = request.GET

    fields = [f.name for f in FishCollectionRecord._meta.get_fields()]
    fields.remove('ready_for_validation')
    fields.remove('validated')
    if 'biologicalcollectionrecord_ptr' in fields:
        fields.remove('biologicalcollectionrecord_ptr')

    # Create the HttpResponse object with the appropriate CSV header.
    location_site = LocationSite.objects.get(id=site_id)
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = \
        'attachment; filename="'+ location_site.name +'.csv"'

    writer = csv.writer(response)

    # Search collection
    collection_results, \
    site_results, \
    fuzzy_search = GetCollectionAbstract.apply_filter(
            query_value,
            filters,
            ignore_bbox=True)

    if not collection_results:
        return response

    records = [q.object for q in collection_results]

    writer.writerow(['Location site name', location_site.name])
    writer.writerow(['Total records', len(records)])
    writer.writerow([''])
    writer.writerow(fields + ['coordinates'])

    for fish in records:
        record = fish.get_children()
        row_object = []
        for field in fields:
            row_object.append(getattr(record, field))
        row_object.append('%s,%s' % (
            record.site.get_centroid().coords[1],
            record.site.get_centroid().coords[0]
        ))
        writer.writerow(row_object)

    return response
