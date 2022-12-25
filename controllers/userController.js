const User = require("./../models/userModel");
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.userData = async (req, res) => {
  try {
    const data = await User.find();
    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      data: {
        data,
      },
    });
  } catch (err) {
    res.status(500).json({ err });
  }
};
exports.updateMe = async (req, res, next) => {
  try {
    // create error if user posts password database
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        res
          .status(400)
          .json({ message: "This route is not for password update" })
      );
    }
    // update user document
    const filteredBody = filterObj(req.body, "name", "email");
    //findByIdAndUpdate need a FUNCTION after requirement
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message});
  }
};
exports.deleteMe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { active: false });
        res.status(204).json({
          status: 'success',
          data: null
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message});
      }
  };