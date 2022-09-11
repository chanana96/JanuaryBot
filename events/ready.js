const fs = require("fs");
rem = require('../reminders.json')

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log('ready');
		setInterval(()=>{
			for (let i in rem){
				let time = rem[i].time
				let channelid = rem[i].channelid
				let userId = rem[i].id
				let remMsg = rem[i].msg
	
				if (Date.now() > time){
					console.log('times up, deleted!')
					client.channels.cache.get(channelid).send(`<@${userId}> ${remMsg}`)
					delete rem[i]
				}
				
			}
			fs.writeFile('./reminders.json', JSON.stringify(rem, null, 4), err =>{
				if(err) throw err;
			})
		}, (5000))
	}
}
