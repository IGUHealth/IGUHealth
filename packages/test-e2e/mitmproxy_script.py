from mitmproxy import http

def request(flow: http.HTTPFlow) -> None:
    if "dpamtgk6fe2d6c51iro5f.localhost" in flow.request.host:
        flow.request.host = "localhost"
