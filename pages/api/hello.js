import clientPromise from "../../mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;

  const db = client.db("tipset-next");

  let users = await db.collection("daily").find({}).toArray();
  res.status(200).json(users);
}
