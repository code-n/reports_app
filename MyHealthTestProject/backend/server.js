import SERVER from './app';

//	default to port 3000
const PORT = process.env.PORT || '3000';

//	Start Server
SERVER.listen(PORT);
console.log(`Listening on port ${PORT}`);