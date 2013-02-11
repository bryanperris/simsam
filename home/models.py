from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Project(models.Model):
    """A project containing an animation, a simulation, and associated data."""
    name = models.CharField(max_length=100)
    owner = models.ForeignKey('SimsamUser', related_name="projects")
    parent_project = models.ForeignKey('Project',
        related_name='child_projects', blank=True)

    # implicit properties
    # * animations (many animations to one project)
    # * simulations (many simulations to one project)
    # * child_projects (many child projects to one parent project)

class SimsamUser(models.Model):  
    """One-to-one with a django user, but with SiMSAM-related info."""
    user = models.OneToOneField(User, primary_key=True)
    first_name = models.CharField(max_length=40)
    last_name = models.CharField(max_length=40)
    sprite_collection = models.TextField(blank=True)

    # implicit properties
    # * projects (many projects to one owner)
