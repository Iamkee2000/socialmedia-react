import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => { // retrieve user information based on their id
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => { //retrieve the friends of a user based on their id.
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(//Retrieves the list of friends by iterating through the user.friends array 
      user.friends.map((id) => User.findById(id))//and fetch each friend's data .
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {//adding and removing friend
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);//fetch users objects from database
    const friend = await User.findById(friendId);//fetch friends objects from database

    if (user.friends.includes(friendId)) {//if friendId is in friend list
      user.friends = user.friends.filter((id) => id !== friendId);//remove the friend from user friend list
      friend.friends = friend.friends.filter((id) => id !== id);//remove the user from the friend list
    } else {
      user.friends.push(friendId);//add friend to both list
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};