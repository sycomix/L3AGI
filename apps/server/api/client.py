from gql import Client
from gql.transport.requests import RequestsHTTPTransport
from config import Config


def create_client(url: str, headers=None, cookies=None):
    transport = RequestsHTTPTransport(
        url=url, verify=True, retries=3, timeout=300, headers=headers, cookies=cookies
    )

    return Client(transport=transport, fetch_schema_from_transport=False)


L3_CORE_API_URL = f"{Config.L3_API_URL}/graphql"
L3_AUTH_API_URL = f"{Config.L3_AUTH_API_URL}/graphql"


class L3Api:
    def __init__(self, headers, cookies):
        self.headers = {
            "authorization": headers.get("authorization"),
            "x-refresh-token": headers.get("x-refresh-token"),
            "accountid": headers.get("accountid"),
        }

        self.cookies = cookies

        from api.game import L3GameApi
        from api.collection import L3CollectionApi

        self.game = L3GameApi(self)
        self.collection = L3CollectionApi(self)

    def request_core(self, query, variable_values=None):
        client = create_client(L3_CORE_API_URL, self.headers, None)
        return client.execute(query, variable_values)

    def request_auth(self, query, variable_values=None):
        client = create_client(L3_AUTH_API_URL, self.headers, None)
        return client.execute(query, variable_values)
