/**
 * Logging utility for the Bucket List application
 * Provides structured logging with different levels
 */

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

interface LogContext {
  userId?: string;
  action?: string;
  resource?: string;
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${level}: ${message}${contextStr}`;
  }

  info(message: string, context?: LogContext): void {
    console.log(this.formatMessage(LogLevel.INFO, message, context));
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, context));
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
      } : String(error),
    };
    console.error(this.formatMessage(LogLevel.ERROR, message, errorContext));
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, context));
    }
  }

  // Specific logging methods for common operations
  auth(action: 'register' | 'login' | 'logout', userId: string, success: boolean): void {
    this.info(`Auth: ${action}`, { userId, action, success });
  }

  apiRequest(method: string, path: string, userId?: string, statusCode?: number): void {
    this.info(`API Request: ${method} ${path}`, { method, path, userId, statusCode });
  }

  dbOperation(operation: string, model: string, success: boolean, error?: Error): void {
    if (success) {
      this.debug(`DB: ${operation} ${model}`, { operation, model, success });
    } else {
      this.error(`DB: ${operation} ${model} failed`, error, { operation, model });
    }
  }
}

export const logger = new Logger();
