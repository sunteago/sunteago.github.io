const Message = require('../models/message');
const User = require('../models/user');

exports.getMessages = async (req,res,next) => {
    const userId = req.user.userId;
    if (!userId) return res.status(404).json({message: 'User not found'});
    try {
        const messages = await Message
            .find({to: userId})
            .populate('from', 'avatar username name')
            .populate('to', 'avatar username name');
        console.log("MENSAJES FETCHEADOS:", messages);
        return res.status(200).json({message: 'Messages fetched sucessfully!', data: messages});
    } catch (err) {
        return res.status(500).json({message: 'Internal Server Error'});
    }
}

exports.postMessage = async (req,res,next) => {
    const userId = req.user.userId;
    if (!userId) return res.status(404).json({message: 'User not found'});
    const {title, destId, content} = req.body;
    if (!userId || !destId || !content || !title) {
        return res.status(400).json({message: 'Message lacks of data'});
    }
    const message = new Message({
        from: userId,
        to: destId,
        content,
        title,
        sentAt: new Date()
    })
    await message.save();
    return res.status(201).json({message: 'Message sent sucessfully'});

};

exports.deleteMessage = async (req,res,next) => {
    const userId = req.user.userId;
    const messageId = req.params.messageId;
    if (!userId) return res.status(404).json({message: 'User not found'});
    try {
        const msg = await Message.findById(messageId);
        if (msg.to.toString() !== userId.toString()) {
            return res.status(403).json({message: 'Not Authorized'});
        }
        await Message.findByIdAndDelete(messageId);
        res.status(202).json({message: 'Message deleted sucesfully'});
    } catch (err) {

    }
};