from django.db import models
from apps.accounts.models import User

class Restaurant(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='restaurants')
    name = models.CharField(max_length=200)
    logo = models.ImageField(upload_to='restaurants/logos/', blank=True, null=True)
    cover_image = models.ImageField(upload_to='restaurants/covers/', blank=True, null=True)
    description = models.TextField(blank=True)
    address = models.CharField(max_length=500)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    website_url = models.URLField(blank=True)
    opening_hours = models.JSONField(default=dict)  # Store opening hours as JSON
    primary_color = models.CharField(max_length=7, default='#0066FF')  # Hex color
    secondary_color = models.CharField(max_length=7, default='#0052CC')
    theme_style = models.CharField(max_length=50, default='modern')
    is_active = models.BooleanField(default=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

class Table(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='tables')
    table_number = models.CharField(max_length=50)
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True, null=True)
    qr_code_text = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['restaurant', 'table_number']
    
    def __str__(self):
        return f"{self.restaurant.name} - Table {self.table_number}"
    
    def get_menu_url(self):
        return f"/menu/{self.restaurant.id}/{self.id}/"
