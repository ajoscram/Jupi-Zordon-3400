import psutil

__PROC_NAME__ = "LeagueClientUx.exe"
__APP_PORT_ID__ = "app-port"
__AUTH_TOKEN_ID__ = "remoting-auth-token"
__SEPARATOR__ = "="

__port__ = None
__password__ = None

def get_port():
    if __port__ is None:
        __initialize__()
    return __port__

def get_password():
    if __password__ is None:
        __initialize__()
    return __password__

def __initialize__():
    for process in psutil.process_iter():
        if process.name() == __PROC_NAME__:
            command_line_parts = process.cmdline()
            __set_vars__(command_line_parts)
            __validate_vars__()
            return
    raise Exception(f"Could not find the '{__PROC_NAME__}' process. Make sure your LoL client is running.")

def __set_vars__(command_line_parts):
    global __port__, __password__
    for part in command_line_parts:
        if __APP_PORT_ID__ in part and __SEPARATOR__ in part:
            __port__ = part.split(__SEPARATOR__, 1)[1]
        elif __AUTH_TOKEN_ID__ in part and __SEPARATOR__ in part:
            __password__ = part.split(__SEPARATOR__, 1)[1]

def __validate_vars__():
    if __port__ == None:
        raise Exception(f"Could not find the '{__APP_PORT_ID__}' flag on the '{__PROC_NAME__}' process.")
    elif __password__ == None:
        raise Exception(f"Could not find the '{__AUTH_TOKEN_ID__}' flag data on the '{__PROC_NAME__}' process.")