import UserTournament from "../../../../models/user-tournament";
import User from "../../../../models/user";
import connectDB from "../../../../middleware/mongodb";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

function handler(req, res) {
  if (req.method === "DELETE") {
    deleteUserTournament(req, res);
  }
}

export default connectDB(handler);

const deleteUserTournament = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  const user = await User.findOne({ email: session?.user.email });
  const { id } = req.query;

  const userTournament = await UserTournament.findById(id);

  if (userTournament.owner.equals(user._id)) {
    await userTournament.delete();
    return res.status(200).send(`Grupp ${userTournament.name} är raderad`);
  }

  return res.sendStatus(401);
};
