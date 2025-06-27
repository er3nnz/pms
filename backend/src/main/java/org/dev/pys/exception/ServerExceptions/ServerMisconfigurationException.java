package org.dev.pys.exception.ServerExceptions;

public class ServerMisconfigurationException extends RuntimeException {
    public ServerMisconfigurationException(String message) {
        super(message);
    }
}
