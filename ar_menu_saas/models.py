from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('restaurant_owner', 'Restaurant Owner'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='restaurant_owner')
    phone_number = models.CharField(max_length=15, blank=True)
    country = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.email
