import express from 'express';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { User } from '../models/user_model';
import bcryptjs from 'bcryptjs';


export const signup = async (req: Request, res: Response) => {
    const { email, name, password } = req.body;

    if(!email || !name || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const existinguser = await User.findOne({email});
    if(existinguser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashpassword = await bcryptjs.hash(password, 10);

    const newuser = {
        email,
        name,
        password: hashpassword
    };
    
    const createdUser = await User.create(newuser);

    const token = jwt.sign({
        userId: createdUser._id,
        email: createdUser.email,
        name: createdUser.name
        }, process.env.JWT_SECRET_KEY as string,{
            expiresIn: '7d'
        });

        return res.status(201).json({
        message: 'User created successfully',
        token,
        user: {
            id: createdUser._id,
            email: createdUser.email,
            name: createdUser.name
        }
    });
}

export const signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if(!user){
        return res.status(400).json({ message: 'User does not exist' });
    }
    //password vaild
    const ispasswordvaild = await bcryptjs.compare(password, user.password);
    if(!ispasswordvaild) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({
        userId: user._id,
        email: user.email,
        name: user.name
    }, process.env.JWT_SECRET_KEY as string, {
        expiresIn: '7d'
    });

    return res.status(200).json({
        message: 'User signed in successfully',
        token,
        user: {
            id: user._id,
            email: user.email,
            name: user.name
        }
    });
}