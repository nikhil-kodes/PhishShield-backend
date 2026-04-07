import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
	try {
		const uri = process.env.MONGODB_URI;

		// TLS/SSL options should be configurable. Defaults keep SSL off for local development.
		const useTLS = (process.env.MONGODB_USE_TLS || 'false').toLowerCase() === 'true';
		const tlsAllowInvalid = (process.env.MONGODB_TLS_ALLOW_INVALID || 'false').toLowerCase() === 'true';

		const options = {
			// modern mongoose driver doesn't require these flags; only include TLS settings when requested
		};

		if (useTLS) {
			options.tls = true;
			options.tlsAllowInvalidCertificates = tlsAllowInvalid;
		}

		await mongoose.connect(uri, options);
		console.log('MongoDB connected');
	} catch (err) {
		console.error('MongoDB connection error:', err.message);
		process.exit(1);
	}
};

export default connectDB;
