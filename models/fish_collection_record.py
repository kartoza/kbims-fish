# coding=utf-8
"""Fish collection record model definition.

"""

from django.db import models

from bims.models.biological_collection_record import \
    BiologicalCollectionRecord


class FishCollectionRecord(BiologicalCollectionRecord):
    """First collection model."""
    HABITAT_CHOICES = (
        ('euryhaline', 'Euryhaline'),
        ('freshwater', 'Freshwater'),
    )

    habitat = models.CharField(
        max_length=50,
        choices=HABITAT_CHOICES,
        blank=True,
    )

    # Depth (cm)
    depth_cm = models.FloatField(
        null=True,
        blank=True
    )

    # Near Bed Velocity
    near_bed_velocity = models.CharField(
        max_length=100,
        blank=True
    )

    # Substrate
    substrate = models.CharField(
        max_length=100,
        blank=True,
    )

    # EC (μS/cm)
    ec = models.FloatField(
        null=True,
        blank=True
    )

    # pH
    ph = models.FloatField(
        null=True,
        blank=True
    )

    # DO
    do = models.FloatField(
        null=True,
        blank=True
    )

    # Temp (°C)
    temp = models.CharField(
        max_length=100,
        blank=True
    )

    # Turbidity (NTU)
    turbidity = models.CharField(
        max_length=100,
        blank=True
    )

    # Nutrients
    nutrients = models.CharField(
        max_length=100,
        blank=True
    )

    # noinspection PyClassicStyleClass
    class Meta:
        """Meta class for project."""
        app_label = 'fish'
        verbose_name = 'fish'
        verbose_name_plural = 'fishes'
