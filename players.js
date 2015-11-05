playerConnections = new Map()
Players = new Mongo.Collection('players', {
	transform(player) {
		player.radius = 10+player.points;
		player.color = 'blue'
		return player;
	}
})
Points = new Mongo.Collection('points', {
	transform(point) {
		point.radius = 5;
		point.color = 'red'
		return point;
	}
})

addPoint = function() {
	Points.insert({
		x: Math.random()*1000-500,
		y: Math.random()*1000-500
	})
}

if(Meteor.isServer) {
	Players.remove({})
	Points.remove({})
	for (var i = 0; i<200; ++i) addPoint()
}