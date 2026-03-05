trace_log = []


def add_trace(step_type: str, value: str):

    trace_log.append({
        "step": step_type,
        "value": value
    })


def get_trace():

    return trace_log


def clear_trace():

    trace_log.clear()