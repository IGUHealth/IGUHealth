from mitmproxy import http
import os

CI_TENANT_ID = os.environ.get("CI_TENANT_ID")

def request(flow: http.HTTPFlow) -> None:
    if f"{CI_TENANT_ID}.localhost" in flow.request.host:
        flow.request.host = "localhost"
