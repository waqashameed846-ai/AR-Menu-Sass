from django.db import models
from apps.restaurants.models import Restaurant

class Plan(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    trial_days = models.IntegerField(default=0)
    max_menu_items = models.IntegerField(default=0, help_text="0 for unlimited")
    max_tables = models.IntegerField(default=0, help_text="0 for unlimited")
    has_branding = models.BooleanField(default=True)
    has_analytics = models.BooleanField(default=False)
    has_ar = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class Subscription(models.Model):
    STATUS_CHOICES = (
        ('trial', 'Trial'),
        ('active', 'Active'),
       
