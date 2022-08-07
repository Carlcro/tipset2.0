import connectDB from "../../../middleware/mongodb";
import Player from "../../../models/player";

const getAllPlayers = async (req, res) => {
  const allPlayers = await Player.find();
  res.send(allPlayers);
};

const createPlayer = async (req, res) => {
  /*  if (req.header("password") !== PASSWORD) {
        return res.send(401);
    }
    */
  const player = new Player({
    name: req.body.name,
  });
  try {
    const newPlayer = await player.save();
    return res.send(newPlayer);
  } catch (error) {
    console.log(error);
  }
};

function handler(req, res) {
  if (req.method === "POST") {
    return createPlayer(req, res);
  } else if (req.method === "GET") {
    return getAllPlayers(req, res);
  }
}

export default connectDB(handler);
