import User from '../model/user.js';

/*READ*/
export const getUser = async (req, res) => {
    try{
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);

    }catch (error) {
        res.status(500).json({ message: "Daya Kuch toh Gadbad hai" + error.message });
    }
};

export const getUserFriends = async (req, res) => {
    try{
    const { id } = req.params;
    const user = await User.findById(id);
    const friends = await Promise.all(
        user.friend.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(({ _id, F_name, L_name, pic_path }) => 
    ({return : { _id, F_name, L_name, pic_path }}));
    res.status(200).json(formattedFriends);
    }catch (error) {
        res.status(500).json({ message: "Daya Kuch toh Gadbad hai" + error.message });
    }
};

/*UPDATE*/
export const addRemoveFriend = async (req, res) => {
    try{
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (!user.friend.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== String(friendId));
            friend.friends = friend.friends.filter((id) => id !== String(friendId));
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        };
        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friend.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(({ _id, F_name, L_name, pic_path }) => 
        ({return : { _id, F_name, L_name, pic_path }}));
        res.status(200).json(formattedFriends);

    } catch (error) {
        res.status(500).json({ message: "Daya Kuch toh Gadbad hai" + error.message });
    };
};