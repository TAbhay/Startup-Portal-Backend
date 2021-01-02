const winston = require("winston");

const options = winston.format.combine(
  winston.format.label({
    label: "[BackEnd]",
  }),
  winston.format.timestamp({
    format: "YYYY-MM-DD hh:mm:ss A",
  }),
  winston.format((info) => {
    info.level = info.level.toUpperCase();
    return info;
  })(),
  winston.format.splat(),
  winston.format.json()
);

const InfoFilter = winston.format((info, opts) => {
  return info.level === "info" ? info : false;
});

const WarnFilter = winston.format((info, opts) => {
  return info.level === "warn" ? info : false;
});

const ErrorFilter = winston.format((info, opts) => {
  return info.level === "error" ? info : false;
});

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        options,
        winston.format.printf((info) => {
          return `${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`;
        }),
        winston.format.colorize({
          all: true,
        })
      ),
    }),
    new winston.transports.File({
      filename: __dirname + "/logs/info.log",
      level: "info",
      format: winston.format.combine(InfoFilter(), options),
    }),
    new winston.transports.File({
      filename: __dirname + "/logs/warn.log",
      level: "warn",
      format: winston.format.combine(WarnFilter(), options),
    }),
    new winston.transports.File({
      filename: __dirname + "/logs/error.log",
      level: "error",
      format: winston.format.combine(ErrorFilter(), options),
    }),
  ],
});

module.exports = logger;
