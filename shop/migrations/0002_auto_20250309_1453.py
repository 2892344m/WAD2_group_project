# Generated by Django 2.2.28 on 2025-03-09 14:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='useraccount',
            name='email_address',
        ),
        migrations.RemoveField(
            model_name='useraccount',
            name='forename',
        ),
        migrations.RemoveField(
            model_name='useraccount',
            name='surname',
        ),
    ]
