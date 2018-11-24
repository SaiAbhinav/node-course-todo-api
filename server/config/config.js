var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/TodoApp";
} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/TodoAppTest";
}

console.log(`ENV:           ${env}`);
console.log(`PORT:          ${process.env.PORT}`);
console.log(`MONGODB_URI:   ${process.env.MONGODB_URI}`);