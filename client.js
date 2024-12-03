const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync("user.proto");
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const userProto = grpcObject.userPackage;

const client = new userProto.userService(
  "localhost:4000",
  grpc.credentials.createInsecure()
);

client.addUser(
  {
    id: 1,
    name: "Vignesh",
    email: "svicky9777@gmail.com",
  },
  (err, response) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log(response);
    }
  }
);
client.addUser(
  {
    id: 2,
    name: "Abin",
    email: "abin@gmail.com",
  },
  (err, response) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log(response);
    }
  }
);
client.addUser(
  {
    id: 3,
    name: "Logesh",
    email: "loki@gmail.com",
  },
  (err, response) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log(response);
    }
  }
);

setTimeout(() => {
    client.listUsers({}, (err, response) => {
      if (err) {
        console.error("Error fetching user list:", err.message);
      } else {
        console.log("User List:");
        response.users.forEach((user, index) => {
          console.log(`${index + 1}. ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`);
        });
      }
    });

    const call = client.listUsersStream({})
    call.on("data", user=>{
        console.log("The stream received " + JSON.stringify(user))
    })
    call.on("end" , e => console.log("Server done")
    )
  }, 1000); 
