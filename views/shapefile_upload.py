from bims.views.shapefile_upload import \
    ShapefileUploadView, process_shapefiles
from fish.models.fish_collection_record import FishCollectionRecord


class ShapefileUploadView(ShapefileUploadView):
    template_name = 'fish_shapefile_uploader.html'


def fish_process_shapefiles(request):
    additional_fields = {
        'present': 'bool',
        'absent': 'bool',
        'habitat': 'str'
    }
    return process_shapefiles(
            request=request,
            collection=FishCollectionRecord,
            additional_fields=additional_fields)
