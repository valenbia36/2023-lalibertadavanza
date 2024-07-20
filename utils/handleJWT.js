const jsonWT = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const tokenSign = async (user) => {
  const sign = await jsonWT.sign(
    {
      _id: user._id,
    },
    JWT_SECRET,
    {
      expiresIn: "3h",
    }
  );
  return sign;
};

function verifyToken(req, res, next) {
  const authorizationHeader = req.headers["authorization"];

  if (!authorizationHeader) {
    return res.status(403).json({ message: "Token not provided" });
  }

  const token = authorizationHeader.split(" ")[1]; // Extract the token part

  if (!token) {
    return res.status(403).json({ message: "Invalid token format" });
  }
  jsonWT.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Failed to authenticate token" });
    }

    req.user = decoded;
    next();
  });
}

module.exports = { tokenSign, verifyToken };
