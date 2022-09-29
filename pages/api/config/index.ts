import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../middleware/mongodb";
import Config from "../../../models/config";

const updateConfig = async (req: NextApiRequest, res: NextApiResponse) => {
  const config = await Config.findOne();

  for (const [key, value] of Object.entries(req.body)) {
    config[key] = value;
  }

  const newConfig = await config.save();

  res.send(newConfig);
};

const createConfig = async (req: NextApiRequest, res: NextApiResponse) => {
  const existingConfig = await Config.findOne();

  if (existingConfig) {
    return res.status(400).send("config already exists");
  }

  const config = new Config();
  const newConfig = await config.save();

  res.send(newConfig);
};

const getConfig = async (req: NextApiRequest, res: NextApiResponse) => {
  const config = await Config.findOne();
  return res.send(config);
};

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == "GET") {
    return getConfig(req, res);
  }

  if (req.headers["password"] !== process.env.API_SECRET_KEY) {
    return res.send(401);
  }

  if (req.method === "PUT") {
    return updateConfig(req, res);
  }

  if (req.method === "POST") {
    return createConfig(req, res);
  }
}

export default connectDB(handler);
