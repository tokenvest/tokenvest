import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../utils/db";
import { User } from "../../models/userModel";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();

  switch (req.method) {
    case "GET":
      const users = await User.find({});
      res.status(200).json(users);
      break;
    case "POST":
      const {
        account,
        profileId,
        signature,
        name,
        surname,
        address,
        walletAddress,
      } = req.body;
      const user = await User.create({
        account,
        profileId,
        signature,
        name,
        surname,
        address,
        walletAddress,
      });
      res.status(201).json(user);
      break;
    default:
      res.status(405).end();
      break;
  }
};
