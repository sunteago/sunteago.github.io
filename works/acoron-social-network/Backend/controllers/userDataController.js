const User = require('../models/user');
const Thought = require('../models/thought');

exports.postUserSettings = async (req, res, next) => {
    const newSettings = {
        settings: {
            theme: req.body.theme,
            privacity: req.body.privacity,
            status: req.body.status
        }
    };
    if (req.file) {
        newSettings.avatar = req.file.path;
    }
    try {
        const user = await User.findOneAndUpdate({ _id: req.user.userId }, { ...newSettings }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(201).json({ message: 'Settings updated correctly', avatar: user.avatar, settings: user.settings });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'There was an error' });
    }
};

exports.getUserProfile = async (req, res, next) => {
    const accountId = req.params.accountId;
    try {
        const user = await 
            User.findById({ _id: accountId })
            // Que cada usuario tenga su lista de post
            .select('username name settings.status avatar');
        if (!user) return res.status(404).json({ message: 'User not found' });
        const thoughts = await Thought.find({accountId});
        return res.status(200).json({
            message: 'User fetched successfully',
            data: {
                username: user.username,
                name: user.name,
                status: user.settings.status,
                avatar:  user.avatar,
                thoughts
            }
        })

    } catch (err) {
       return res.status(500).json({message: 'Internal Server Error'});
    }

};