const User = require('../models/User');

const register = async (req, res) => {
	try {
		const user = await User.create({ ...req.body });
		const token = user.createJWT();
		res.status(200).json({ user, token });
	} catch (error) {
		console.log(error);
		res.status(500).json({ status: 'error', error_message: 'Duplicate email' });
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(500).json({ status: 'error', error_message: 'Please provide email and password' });
	}

	const user = await User.findOne({ email });
	if (!user) {
		return res.status(500).json({ status: 'error', error_message: `No user found with email: ${email}` });
	}

	const isPasswordCorrect = await user.comparePasswords(password);
	if (!isPasswordCorrect) {
		return res.status(500).json({ status: 'error', error_message: 'Invalid password' });
	}

	const token = user.createJWT();
	res.status(200).json({ user, token });
};

module.exports = { register, login };
