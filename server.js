const mongoose=require('mongoose');
const dotenv=require('dotenv');

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION\n shutting down....');
    console.log(err.name, err.message);
    process.exit(1);
  });
  

dotenv.config({ path: './config.env' });
const app=require('./app');



const DB=process.env.DATABASE.replace('<password>',process.env.DATABASE_PASSWORD)


mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection connected successfully'));

const Port=process.env.PORT||3000;
const server=app.listen(Port,()=>{
    console.log(`Application is running on Port ${Port}`);
});


process.on('unhandledRejection', (err) => {
  console.log('UNHANDLER REJECTION\n shutting down....');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
