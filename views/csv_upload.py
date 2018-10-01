# coding=utf-8
"""CSV uploader view
"""

from django.urls import reverse_lazy
from bims.views.csv_upload import CsvUploadView as BaseCsvUploadView
from fish.models.fish_collection_record import FishCollectionRecord


class CsvUploadView(BaseCsvUploadView):
    """Csv upload view."""

    collection_record = FishCollectionRecord
    template_name = 'fish_csv_uploader.html'
    success_url = reverse_lazy('fish:fish-csv-upload')
    fish_additional_fields = {
        'habitat': 'char',
        'depth_cm': 'float',
        'near_bed_velocity': 'str',
        'substrate': 'str',
        'ec': 'float',
        'ph': 'float',
        'do': 'float',
        'temp': 'str',
        'turbidity': 'str',
        'nutrients': 'str',
        'fbis_site_code': 'str',
        'hydraulic_biotope': 'str'
    }

    def __init__(self):
        self.additional_fields.update(self.fish_additional_fields)
