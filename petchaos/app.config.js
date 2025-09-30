// Dynamic config to read env variables during build
import 'dotenv/config';

export default ({ config }) => ({
	...config,
	entryPoint: './index.js',
	extra: {
		AI_PROVIDER: process.env.AI_PROVIDER || 'mock',
		OPENAI_API_KEY: process.env.OPENAI_API_KEY || ''
	},
	ios: {
		...config.ios,
		infoPlist: {
			...(config.ios?.infoPlist || {}),
			NSPhotoLibraryUsageDescription: 'We use your photos to feed your pet memes.',
			NSCameraUsageDescription: 'Take photos to feed your pet.',
			NSMicrophoneUsageDescription: 'Record audio to feed your pet.'
		}
	}
});

