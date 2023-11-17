import jwt from "jsonwebtoken";
//authorization is bascially when the users logged in they have functions or they can do things that a non-logged in users can do 
//so they can hit api endpoints that a normal user would not be able to.

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");//retrieves the JWT token request
    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();//removes that prefix to extract the actual token value.
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);//verify the token's authenticity and expiration.
    req.user = verified;// valid information is stored in req.user. 
    next();//  is called to pass control to the next middleware or route handler in the request/response cycle.
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};