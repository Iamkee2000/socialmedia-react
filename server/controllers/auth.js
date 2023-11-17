import bcrypt from "bcrypt"; // is used for hashing and salting passwords
import jwt from "jsonwebtoken"; //send user a web token that they can use for authorization 
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => { //calling mongodb req request body is what we get from the front end, res what we are going to be sending back to the front end

  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;//Destructuring these fields from the request body
    //from the front end,we are going to send an object that have these arguments and use this in the function.

    const salt = await bcrypt.genSalt();//generates a salt 
    const passwordHash = await bcrypt.hash(password, salt);//password is hashed using with the generated salt.

    const newUser = new User({//A new user object is created using the User model, and the hashed password is stored in the database.
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;//grabbing the email and password from the request body.
    const user = await User.findOne({ email: email });//using mongoose to find user with the provided email
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);//if is found compare the entered password with the hashed password.
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });
//when you register and login, it gives u somekind of token or validation and then the user can use that to sign in.
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);//if Auth success, a JWT is created using jwt sign
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
