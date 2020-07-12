const Thought = require('../models/thought');
const User = require('../models/user');
const io = require('../socket');
const { validationResult } = require('express-validator');

exports.getThoughts = async (req, res, next) => {
    try {
        const fetchedThoughts = await Thought.find()
            .populate('accountId', 'avatar username name')
            .sort({ createdAt: -1 });
        res.status(200).json(fetchedThoughts);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching thoughts' });
    }
};

exports.createThought = async (req, res, next) => {
    const errors = validationResult(req);
    console.log("ERRORES:", errors);
    if (!errors.isEmpty()) {
        return res.status(422).json({ message: 'Problem creating thought', errors: errors.array() });
    }
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({message: 'User not found'});
        const thought = new Thought({
            // author: req.body.author,
            account: req.body.account,
            accountId: req.user.userId,
            content: req.body.thought.content,
            createdAt: new Date()
        })
        await thought.save();
        await res.status(201).json({
            message: 'Thought created successfully',
            thought
        });
        io.getIO().emit('thoughts', { action: 'createThought' });
    } catch (err) {
        console.log(err);
    }
}

exports.getThought = async (req, res, next) => {
    try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId })
            .populate('comments.accountId', 'name username avatar')
            .populate('accountId', 'username name avatar')
            .exec();
        if (!thought) throw new Error('No thought found');
        res.status(200).json(thought);
    } catch (err) {
        console.log(err);
        res.status(404).json({ msg: err })
    }
};

exports.deleteThought = async (req, res, next) => {
    const userId = req.user.userId;
    const thoughtId = req.params.thoughtId;
    if (!userId) return status(404).json({ message: 'User does not exist' });
    try {
        const thought = await Thought.findById(thoughtId);
        if (!thought) {
            return res.status(404)
                .json({ message: 'Invalid thoughtId, not found' })
        }
        if (thought.accountId.toString() !== userId.toString()) {
            return res.status(401).json({ message: 'Not Authorized' })
        }
        await Thought.deleteOne({ _id: thoughtId });
        await res.status(202).json({ message: 'Deleted Successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.deleteComment = async (req, res, next) => {
    const userId = req.user.userId;
    const thoughtId = req.params.thoughtId;
    const commentId = req.params.commentId;
    if (!userId) return status(404).json({ message: 'User does not exist' });
    try {
        const thought = await Thought.findById(thoughtId);
        if (!thought) {
            return res.status(404).json({ message: 'Invalid thoughtId, not found' });
        }

        thought.comments = thought.comments.filter(comment =>
            !(comment._id.toString() === commentId.toString() &&
            comment.accountId.toString() === userId.toString())
        );

        await thought.save();
        await res.status(202).json({ message: 'Deleted Successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


exports.postAddComment = async (req, res, next) => {
    const userId = req.user.userId;
    if (!userId) return res.status(404).json({ message: 'User not found' });
    const thought = await Thought.findById(req.params.thoughtId);
    thought.comments.push({
        content: req.body.content,
        accountId: userId,
        createdAt: new Date()
    })
    await thought.save();
    await res.status(200).json({ message: 'Comment created successfully' });
    io.getIO().emit('thoughts', { action: 'createComment' });
};

exports.postLikeThought = async (req, res, next) => {
    const thoughtId = req.params.thoughtId;
    const userId = req.user.userId;
    if (!userId) return res.status(403).json({message: 'Not Authorized'});
    try {
        const thought = await Thought.findById(thoughtId);
        if (!thought) return res.status(404).json({ message: 'Thought not found' });
        const alreadyLiked = thought.whoLiked.find(accountId => {
            return accountId.toString() === userId.toString();
        });
        if (alreadyLiked) return res.status(403).json({message: 'The user already liked this'});
        thought.whoLiked.push(userId);
        thought.likes++;
        await thought.save();
        await res.status(201).json({ message: 'Thought updated sucesfully with the likes' });
        io.getIO().emit('thoughts', {action: 'likeThought', thoughtId});
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Thought could not be updated with the likes' });
    }
};

exports.postLikeComment = async (req, res, next) => {
    const thoughtId = req.params.thoughtId;
    const commentId = req.body.commentId;
    const userId = req.user.userId;
    try {
        //find thought
        const thought = await Thought.findById(thoughtId);
        if (!thought) return res.status(404).json({ message: 'Thought not found' });
        //get selected comment idx and the comment itself 
        let selectedComment = {};
        for (let i = 0; i < thought.comments.length; i++) {
            if (thought.comments[i]._id.toString() === commentId.toString()) {
                selectedComment = {idx: i, comment: thought.comments[i]}
            }
        }        
        if (Object.entries(selectedComment) === 0) {
            return res.status(404).json({message: 'The comment does not exist'});
        } 
        //check if already liked it
        const alreadyLiked = selectedComment.comment.whoLiked.find(accountId => {
            return accountId.toString() === userId.toString();
        });
        if (alreadyLiked) return res.status(403).json({message: 'The user already liked this'});
        //push new comment into document, save document
        selectedComment.comment.whoLiked.push(userId);
        selectedComment.comment.likes++;
        thought.comments[selectedComment.idx] = selectedComment.comment;
        await thought.save();
        await res.status(201).json({ message: 'Thought updated sucesfully with the likes' });
        // io.getIO().emit('thoughts', {action: 'likeComment', thoughtId});
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Thought could not be updated with the likes' });
    }
};