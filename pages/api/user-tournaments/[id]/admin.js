import UserTournament from "../../../../models/user-tournament";
import User from "../../../../models/user";
import connectDB from "../../../../middleware/mongodb";

function handler(req, res) {
  if (req.method === "DELETE") {
    deleteUserTournament(req, res);
  }
}

export default connectDB(handler);

const deleteUserTournament = async (req, res) => {
  const user = await User.findOne({ userId: "123" });
  const { id } = req.query;

  const userTournament = await UserTournament.findById(id);

  if (userTournament.owner.toString() === user._id.toString()) {
    await userTournament.delete();
    return res.status(200).send(`Grupp ${userTournament.name} är raderad`);
  }

  return res.sendStatus(401);
};
