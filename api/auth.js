import connectToDatabase from "../controllers/connecttoDb";
import { chain } from "@amaurymartiny/now-middleware";
import cors from "cors";
import morgan from "morgan";

const auth = async (req, res) => {
  if (req.method === "GET") {
    const signOut = (await import("../controllers/auth/SignOut")).default;
    return signOut(req, res);
  }
  if (req.method != "POST") {
    return res.status(404).json({
      message: `Unknown method ${req.method}.Only POST request allowed`,
    });
  }
  console.log("POST request to /api/auth ...");
  await connectToDatabase(process.env.MONGODB_URI);
  switch (req.body.method) {
    case "SIGNIN":
      const signIn = (await import("../controllers/auth/SignIn")).default;
      return await signIn(req, res);

    case "SIGNUP":
      const signUp = (await import("../controllers/auth/SignUp")).default;
      return await signUp(req, res);

    case "VERIFY":
      const verify = (await import("../controllers/auth/Verify")).default;
      return verify(req, res);

    default:
      return res.status(404).json({
        message: "Unknown Method",
      });
  }
};

module.exports = chain(cors(), morgan("tiny"))(auth);
