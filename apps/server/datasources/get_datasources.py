from datasources.postgres.postgres import PostgresDatasource
from datasources.mysql.mysql import MySQLDatasource
from datasources.file.file import FileDatasource
from datasources.base import DatasourceType, DatasourceCategory

DATASOURCES = [
    PostgresDatasource(),
    MySQLDatasource(),
    FileDatasource(),
]

COMING_SOON = [
    {
        "is_public": True,
        "is_active": False,
        "name": "Crawler",
        "description": "Crawl the web page",
        "category": DatasourceCategory.CRAWLER,
        "source_type": DatasourceType.WEB_PAGE,
    },
    {
        "is_public": True,
        "is_active": False,
        "name": "Notion",
        "description": "Notion",
        "category": DatasourceCategory.APPLICATION,
        "source_type": DatasourceType.NOTION,
    },
    {
        "is_public": True,
        "is_active": False,
        "name": "Google Analytics",
        "description": "Google Analytics",
        "category": DatasourceCategory.APPLICATION,
        "source_type": DatasourceType.SHOPIFY,
    },
    {
        "is_public": True,
        "is_active": False,
        "name": "Firebase",
        "description": "Firebase",
        "category": DatasourceCategory.APPLICATION,
        "source_type": DatasourceType.SHOPIFY,
    }
]

def get_all_datasources():
    """Return a list of all datasources."""
    result = [
        {
            "is_public": True,
            "is_active": datasource.is_active,
            "name": datasource.name,
            "description": datasource.description,
            "category": datasource.category,
            "source_type": datasource.type,
            "fields": [
                {
                    "label": env_key.label,
                    "key": env_key.key,
                    "type": str(env_key.key_type),
                    "is_required": env_key.is_required,
                    "is_secret": env_key.is_secret,
                }
                for env_key in datasource.get_env_keys()
            ],
        }
        for datasource in DATASOURCES
    ]
    result.extend(COMING_SOON)

    return result
