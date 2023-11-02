declare namespace NodeJS {
  export interface ProcessEnv {
    JWT_SECRET: string;
    JWT_REFRESH_TOKEN: string;
    DB_HOST: string;
    DB_PORT: string;
    DB_NAME: string;
    DB_USER: string;
    DB_PASSWORD: string;
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_USERNAME: string;
    REDIS_PASSWORD: string;
    REDIS_TTL: string;
    DATABASE_URL: string;
    MAIL_HOST: string;
    MAIL_PORT: string;
    MAIL_USER: string;
    MAIL_PASSWORD: string;
    MAIL_FROM: string;
    KAFKA_BROKERS: string;
    KAFKA_NOTIFICATION_CONSUMER_ID: string;
    II_STATIC_SECRET: string;
  }
}
