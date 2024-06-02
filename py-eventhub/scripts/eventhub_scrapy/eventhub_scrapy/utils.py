def should_abort_request(req):
    return req.resource_type == "image"