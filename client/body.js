myId = new ReactiveVar()
var center = {x: 100, y: 100}
var direction = [0,0]
var velocity = 1.5

window.requestAnimationFrame(function updateMyPosition() {
	Players.update(myId.get(), {$inc: {
		x: direction[0]*velocity,
		y: direction[1]*velocity
	}})
	window.requestAnimationFrame(updateMyPosition)
})

Template.body.helpers({
	otherPlayers() {
		return Players.find({_id: {$not: myId.get()}, gameOver: {$ne: true}})
	},
	points() {return Points.find()},
	me() { return Players.findOne(myId.get()) },
	invert(number) { return -number }
})

function changeDirection(pushInfo) {
	const d = {
		x: pushInfo.offsetX - center.x,
		y: pushInfo.offsetY - center.y
	} 
	const length = Math.hypot(d.x, d.y)
	direction[0] = d.x/length
	direction[1] = d.y/length
}

Template.body.events({
	'mousemove svg'(event) {changeDirection(event)},
	touchmove(e, t) {
		changeDirection({
			offsetX: e.originalEvent.touches[0].pageX - e.originalEvent.touches[0].target.offsetLeft,
			offsetY: e.originalEvent.touches[0].pageY - e.originalEvent.touches[0].target.offsetTop
		})
	}
})

Tracker.autorun(function() {
	if (Meteor.status().connected == true)
		Meteor.call('myId', (err, result)=>myId.set(result) )
})

Meteor.startup(function() {
	Tracker.autorun(function() {
		const myself = Players.findOne(myId.get())
		if (myself) {
			Points.find({
				x: {$gte: myself.x-myself.radius, $lte: myself.x+myself.radius},
				y: {$gte: myself.y-myself.radius, $lte: myself.y+myself.radius}
			}).forEach(function(point) {
				if (Math.hypot(point.x-myself.x, point.y-myself.y) < (myself.radius - point.radius)) {
					Points.remove(point._id)
					addPoint()
					Players.update(myId.get(), {$inc: {points: 1}})
					velocity *= 0.95
				}
			})
			Players.find({
				_id: {$ne: myId.get()},
				points: {$lt: myself.points},
				x: {$gte: myself.x-myself.radius, $lte: myself.x+myself.radius},
				y: {$gte: myself.y-myself.radius, $lte: myself.y+myself.radius},
				gameOver: {$ne: true}
			}).forEach(function(player) {
				if (Math.hypot(player.x-myself.x, player.y-myself.y) < (myself.radius - player.radius)) {
					Players.update(player._id, {$set: {gameOver: true}})
					Players.update(myId.get(), {$inc: {points: player.points}})
					velocity *= 0.95
				}
			})
		}
	})	
})

screenWidth = new ReactiveVar(100)
screenHeight = new ReactiveVar(100)

Template.body.onRendered(function() {
	var svg = this.find('svg')
	setCenter(svg)
	window.onresize = function() {setCenter(svg)}
})

function setCenter(svg) {
	screenWidth.set(center.x = svg.width.baseVal.value/2)
	screenHeight.set(center.y = svg.height.baseVal.value/2)
}

document.ontouchstart = function(e){ e.preventDefault() }