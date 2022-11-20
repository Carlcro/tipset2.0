import connectDB from "../../../middleware/mongodb";
import User from "../../../models/user";

function handler(req, res) {
  if (req.method === "POST") {
    console.log("asd");
  } else if (req.method === "GET") {
    return getUsers(req, res);
  }
}
export default connectDB(handler);

const getUsers = async (req, res) => {
  let users = await User.find();

  res.status(200).send(users.map((x) => x.fullName));
};
