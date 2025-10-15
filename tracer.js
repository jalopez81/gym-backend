import tracer from 'dd-trace';
import dotenv from 'dotenv';
dotenv.config();

tracer.init({
  service: process.env.DD_SERVICE || 'gym-backend',
  env: process.env.DD_ENV || 'dev',
  logInjection: true,
  debug: true
});

export default tracer;
