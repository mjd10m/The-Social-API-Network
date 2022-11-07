const { Thought, User } = require('../models')

const thoughtController = {
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
}

module.exports = thoughtController
