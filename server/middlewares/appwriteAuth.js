import { Client, Account } from "node-appwrite";
import { config } from '../config/config.js';

export const appwriteAuth = async (req, res, next) => {
  try {
    const client = new Client()
      .setEndpoint(config.APPWRITE_ENDPOINT)
      .setProject(config.APPWRITE_PROJECT_ID);

    // forward cookies from frontend request
    client.headers['X-Fallback-Cookies'] = req.headers.cookie;

    const account = new Account(client);
    const user = await account.get();

    req.userID = user.$id;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
