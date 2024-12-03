const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync("user.proto");
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const userProto = grpcObject.userPackage;

const server = new grpc.Server();

const users = {};

server.addService(userProto.userService.service, {
  addUser: CreateUser,
  getUser: (call, callback) => {
    let userId = call.request;
    let user = users[userId];
    callback(null, user);
  },
  updateUser: UpdateUser,
  deleteUser: DeleteUser,
  listUsers: ListUsers,
  listUsersStream: listUsersStream
});

function CreateUser(call, callback) {
  let user = call.request;
  users[user.id] = user;
  callback(null, user);
}
function UpdateUser(call, callback) {
  const userId = call.request.id; 
  const updatedData = call.request; 
  if (users[userId]) {
    // Update user details
    users[userId] = {
      ...users[userId], 
      ...updatedData, 
    };
    callback(null, users[userId]); 
  } else {
  
    callback({
      code: grpc.status.NOT_FOUND,
      message: `User with ID ${userId} not found.`,
    });
  }
}

function DeleteUser(call, callback) {
  let userId = call.request;
  let user = users[userId];
  users[user.id] = null;
  callback(null, user);
}
function ListUsers(call, callback) {
  const userArray = Object.values(users);
  callback(null, { users: userArray });
}
function listUsersStream(call,callback){
    const userArray = Object.values(users);
    userArray.forEach(user => call.write(user))
    call.end()
}

server.bindAsync(
  "localhost:4000",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Server is running on localhost:4000");
  }
);
