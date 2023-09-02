const mongoose = require("mongoose");

module.exports = async () => {
  const mongoUri =
    "mongodb+srv://ramanmongodb:ZQeNCJkIwjxZ9Wf8@cluster0.3oudvbc.mongodb.net/?retryWrites=true&w=majority";

  const connect = await mongoose
    .connect(mongoUri, { useNewUrlParser: true,
        useUnifiedTopology: true})
    .then(() => {
      console.log("mongodb connected");
    //   console.log(connect.connection.host);
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
};
