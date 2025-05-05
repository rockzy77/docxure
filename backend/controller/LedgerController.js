const LEDGER = require("../models/LedgerModel");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const ACTION = require("../models/ActionLogModel");

const JWT_SECRET = process.env.JSON_SECRET_TOKEN;


async function hashPassword(password) {
    console.log("PASSWORD: ", password);
    const hashed = await bcrypt.hash(password, 10);
    console.log("HASHED: ", hashed);
    return hashed;
}

function generateToken(payload) {
    console.log("======================> ", JWT_SECRET);
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

async function comparePassword(plainPassword, hashedPassword) {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
}

exports.signup = async (req, res) => {
    const { LNAME, LTYPE, LEMAIL, LPHONE, LPASSWORD, LADDRESS, IS_ACTIVE } = req.body;

    try {

        console.log("=========>LPASSWORD: ", LPASSWORD);

        const hashedPassword = await hashPassword(LPASSWORD);

        // Check if email already exists
        const existingUser = await LEDGER.findOne({ where: { LEMAIL } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        };

        const user = await LEDGER.create({ LNAME, LTYPE, LEMAIL, LPHONE, LPASSWORD: hashedPassword, LADDRESS, FIRST_LOGIN: true, IS_ACTIVE });

        const token = generateToken({ id: user.LID, email: user.LEMAIL });

        try {
            await ACTION.create({
                TYPE: 'auth',
                ACTION: 'register',
                ACTION_BY: user.LID
            });
        } catch (actionError) {
            console.log("Error creating action log: ", actionError);
        }

        res.status(201).json({ success: true, message: "User created successfully", user, token });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Error creating user", details: error });
    }
}


exports.login = async (req, res) => {
    const { LEMAIL, LPASSWORD } = req.body;

    console.log("LEMAIL: ", LEMAIL);
    console.log("LPASSWORD: ", LPASSWORD);

    try {
        const user = await LEDGER.findOne({ where: { LEMAIL } });

        if (!user) {
            return res.status(404).json({ sucecss: false, message: "User not found" });
        }

        console.log("USER: ", user.LPASSWORD);

        const isPasswordValid = await comparePassword(LPASSWORD, user.LPASSWORD);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = generateToken({ id: user.LID, email: user.LEMAIL });

        try {
            await ACTION.create({
                TYPE: 'auth',
                ACTION: 'login',
                ACTION_BY: user.LID
            });
        } catch (actionError) {
            console.log("Error creating action log: ", actionError);
        }

        res.status(200).json({ success: true, message: "Login successful", token, user });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Error logging in", details: error });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await LEDGER.findAll();
        res.status(200).json({ users, success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching users", details: error });
    }
};

exports.getUserByEmail = async (req, res) => {
    const { email } = req.params;

    try {
        const user = await LEDGER.findOne({
            where: {
                LEMAIL: email
            }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ user, success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching user", details: error });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const user = await LEDGER.findByPk(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (updates.LPASSWORD) {
            updates.LPASSWORD = await hashPassword(updates.LPASSWORD);
        }

        await user.update(updates);

        
        res.status(200).json({ success: true, message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating user", details: error });
    }
};


exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await LEDGER.findByPk(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await user.destroy();
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting user", details: error });
    }
};

// get token from auth header
exports.getUserByToken = async (req, res) => {
    const token = req.header("Authorization")?.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await LEDGER.findByPk(decoded.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ user, success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching user", details: error });
    }
};