const dialogflow = require('dialogflow');
	
const LANGUAGE_CODE = 'pt-PT' 

class DialogFlow {
    
	constructor (projectId) {
		this.projectId = projectId

		let privateKey = (process.env.NODE_ENV=="production") ? JSON.parse(process.env.DIALOGFLOW_PRIVATE_KEY) : process.env.DIALOGFLOW_PRIVATE_KEY
		let clientEmail = process.env.DIALOGFLOW_CLIENT_EMAIL
		let config = {
			credentials: {
				private_key: privateKey,
				client_email: clientEmail
			}
		}
	
		this.sessionClient = new dialogflow.SessionsClient(config)
	}

	async sendTextMessageToDialogFlow(textMessage, sessionId) {
		// Define session path
		const sessionPath = this.sessionClient.sessionPath(this.projectId, sessionId);
		// The text query request.
		const request = {
			session: sessionPath,
			queryInput: {
				text: {
					text: textMessage,
					languageCode: LANGUAGE_CODE
				}
			}
		}
		try {
			let responses = await this.sessionClient.detectIntent(request)			
			console.log('DialogFlow.sendTextMessageToDialogFlow: Detected intent');
			return responses
		}
		catch(err) {
			console.error('DialogFlow.sendTextMessageToDialogFlow ERROR:', err);
			throw err
		}
	}
}