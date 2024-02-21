# Generated by Django 4.2.8 on 2024-02-20 06:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0002_game_started_at'),
    ]

    operations = [
        migrations.CreateModel(
            name='CasualGameListView',
            fields=[
                ('game_id', models.IntegerField(primary_key=True, serialize=False)),
                ('mode', models.PositiveSmallIntegerField()),
                ('status', models.PositiveSmallIntegerField()),
            ],
            options={
                'db_table': 'casual_game_list_view',
                'managed': False,
            },
        ),
    ]