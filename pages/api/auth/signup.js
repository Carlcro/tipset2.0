import { hash } from "bcryptjs";
import connectDB from "../../../middleware/mongodb";
import User from "../../../models/user";

async function handler(req, res) {
  //Only POST mothod is accepted
  if (req.method === "POST") {
    //Getting email and password from body
    const { email, password, firstName, lastName } = req.body;
    //Validate
    if (!email || !email.includes("@") || !password) {
      res.status(422).json({ message: "Invalid Data" });
      return;
    }

    //Check existing
    const checkExisting = await User.findOne({ email: email });
    //Send error response if duplicate user is found
    if (checkExisting) {
      res.status(422).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await hash(password, 12);

    //Hash password
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
    });

    const newUser = await user.save();

    //Send success response
    res.status(201).json({ message: "User created", ...newUser });
    //Close DB connection
  } else {
    //Response for other than POST method
    res.status(500).json({ message: "Route not valid" });
  }
}

export default connectDB(handler);
