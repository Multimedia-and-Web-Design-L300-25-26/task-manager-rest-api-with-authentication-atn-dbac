import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//to register a user 
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({message: "A user already exists with this email"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    //now to create a user 
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({message: "User registered successfully",
      _id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

//to login a user
export const loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if (!user) {
      return res.status(401).json({message: "Invalid login credentials"});
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch){
      return res.status(401).json({message: "Invalid login credentials"});
    }

    //to create the JWT token 
    const token = jwt.sign(
      {id: user._id},
      process.env.JWT_SECRET,
      {expiresIn: "1h"}
    );
    res.status(200).json({ token });
  }
  catch (error){
    res.status(500).json({message: error.message});
  }
} 
