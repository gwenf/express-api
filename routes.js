'use strict';

var express = require('express');
var router = express.Router();
var Question = require('./models').Question;

router.param('qID', function(req, res, next, id){
	Question.findById(id, function(err, doc){
		if (err) return next(err);
		if (!doc){
			err = new Error("Not Found");
			err.status = 404;
			next(err);
		}
		res.question = doc;
		return next();
	})
})

router.param('aID', function(req, res, next, id){
	req.answers = req.question.answers.id();
	if (!doc){
		err = new Error("Not Found");
		err.status = 404;
		next(err);
	}
	return next();
})

//GET /questions
//TODO: return all the questions
router.get("/", function(req, res, next){
	Question.find({}).sort({createdAt: -1})
			.exec(function(err, question){//-1 sorts in descending order
				if (err) return next(err);
				res.json(question);
			})
	// res.json({response: "you send me a GET request"});
});

//POST /question
//TODO: creating questions
router.post("/", function(req, res, next){
	var question = new Question(req.body);
	question.save(function(err, question){
		if (err) return next(err);
		res.status(201);
		res.json(question);
	})
	// res.json({
	// 	response: "you send me a POST request",
	// 	body: req.body
	// });
});

//GET /question/:id
//TODO: return a question
router.get("/:qID", function(req, res, next){
	res.json(res.question);
	// res.json({
	// 	response: "you send me a GET request for id " + req.params.qID
	// });
});

//POST /:id/answers
//TODO: post answer
router.post("/:qID/answers", function(req, res, next){
	req.question.answers.push(req.body);
	req.question.save(function(err, question){
		if (err) return next(err);
		res.status(201);
		res.json(question);
	});
	// res.json({
	// 	response: "you send me a POST request to /answers",
	// 	questionId: req.params.qID,
	// 	body: req.body
	// });
});

router.put("/:qID/answers/:aID", function(req, res, next){
	req.answer.update(req.body, function(err, result){
		if (err) return next(err);
		res.json(result)
	})
	// res.json({
	// 	response: "you send me a PUT request to /answers",
	// 	questionId: req.params.qID,
	// 	answerId: req.params.aID,
	// 	body: req.body
	// });
});

router.delete("/:qID/answers/:aID", function(req, res){
	req.answer.remove(function(err){
		req.question.save(function(err, question){
			if (err) return next(err);
			res.json(question)
		})
	})
	// res.json({
	// 	response: "you send me a DELETE request to /answers",
	// 	questionId: req.params.qID,
	// 	answerId: req.params.aID
	// });
});

//voting on answers
//  questions/:qID/answers/:aID/vote=:dir (vote-up or vote-down)
router.post("/:qID/answers/:aID/vote-:dir", function(req,res, next){
		if (req.params.dir.search(/up|down/)===-1){
			var err = new Error("Not Found");
			err.status = 404;
			next(err);
		} else {
			next();
		}
	}, function(req, res, next){
		req.answer.vote(req.vote, function(err, question){
			if (err) return next(err);
			res.json(question)
		})
	// res.json({
	// 	response: "you send a POST request to /vote-" + req.params.dir,
	// 	questionId: req.params.qID,
	// 	answerId: req.params.aID,
	// 	vote: req.params.dir
	// });
});


module.exports = router;
