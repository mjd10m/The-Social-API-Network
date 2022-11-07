const { Thought, User } = require('../models')

const thoughtController = {
    //gets all thoughts
    getAllThought(req, res) {
        Thought.find({})
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
    },
    //gets thought by _id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    //creates thought and adds to user model
    addThought({ body }, res) {
        Thought.create(body)
        .then(({ _id}) => {
            return User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: _id }},
                { new: true}
            )
        })
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({message: 'No user found with this ID.'})
                return
            }
            res.json(dbUserData)
        })
        .catch(err => res.json(err))
    },
    //updates thought data
    updateThought({params, body}, res) {
        Thought.findOneAndUpdate({_id: params.id }, body, {new: true})
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({message: 'No thought found with this ID.'})
                return
            }
            res.json(dbThoughtData)
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)})
    },
    //removes thought and removes from user model
    removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
          .then(deletedThought => {
            if (!deletedThought) {
              return res.status(404).json({ message: 'No thought with this id!' });
            }
            return User.findOneAndUpdate(
              { username: deletedThought.username },
              { $pull: { thoughts: params.id } },
              { new: true }
            );
          })
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No pizza found with this id!' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.json(err));
    },
    //adds reaction to thought model
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $push: { reactions: body } },
          { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
          if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
          }
          res.json(dbThoughtData);
        })
        .catch(err => res.json(err))
    },
    //removes reaction from thought model
    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $pull: { reactions: { reactionId: params.reactionId } } },
          { new: true }
        )
          .then(dbThoughtData => res.json(dbThoughtData))
          .catch(err => res.json(err));
      }
}

module.exports = thoughtController
