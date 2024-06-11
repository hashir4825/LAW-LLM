from rest_framework import serializers
from .models import Document

class DocumentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        exclude = ['status', 'user']


class DocumentViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'