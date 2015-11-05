Meteor.onConnection(function(connection) {
	let id = Players.insert({x: 0, y: 0, points: 0})
	playerConnections.set(id, connection)
	connection.playerId = id
	connection.onClose(function() {
		Players.remove(id)
		playerConnections.delete(id)
	})
})

Meteor.methods({
	myId() {
		return this.connection.playerId
	}
})