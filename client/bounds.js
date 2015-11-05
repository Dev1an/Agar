Meteor.startup(function() {
	Tracker.autorun(function() {
		const _id = myId.get()
		Players.find({_id, x: {$lt: -500 - screenWidth.get()}}).forEach(player => {
			Players.update(myId.get(), {$set: {x: 499 + screenWidth.get()}})
		})
		Players.find({_id, x: {$gt: 500 + screenWidth.get()}}).forEach(player => {
			Players.update(myId.get(), {$set: {x: -499 - screenWidth.get()}})
		})
		Players.find({_id, y: {$lt: -500 - screenHeight.get()}}).forEach(player => {
			Players.update(myId.get(), {$set: {y: 499 + screenHeight.get()}})
		})
		Players.find({_id, y: {$gt: 500 + screenHeight.get()}}).forEach(player => {
			Players.update(myId.get(), {$set: {y: -499 - screenHeight.get()}})
		})
	})
})