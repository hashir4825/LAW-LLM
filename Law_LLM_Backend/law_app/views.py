from .models import Document
from rest_framework import generics
from .serializers import DocumentCreateSerializer, DocumentViewSerializer
from rest_framework.permissions import IsAuthenticated


class DocumentCreateView(generics.CreateAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Get the currently logged-in user
        user = self.request.user
        # Set the user and status to 'draft' before saving
        serializer.save(user=user, status='draft')


class SingleDocumentView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentViewSerializer
    permission_classes = [IsAuthenticated]
    

class Document_OfSpecificUser(generics.ListAPIView):
    serializer_class = DocumentViewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of all the documents
        for the currently authenticated user.
        """
        user = self.request.user
        if user.is_authenticated:
            return Document.objects.filter(user=user)
        else:
            return Document.objects.none()  # Return an empty queryset if user is not authenticated