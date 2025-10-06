const Categories = require("../models/categories.model");
const BikeVariant = require("../models/bikevarient.model");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Categories.find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    // Iterate over each category
    for (let i = 0; i < categories.length; i++) {
      const categoryId = categories[i]._id;

      // Find bike variants with the same category ID
      const bikeVariants = await BikeVariant.find({ category_id: categoryId })
        .lean()
        .exec();

      // If bike variants are found, attach colors to the category
      if (bikeVariants.length > 0) {
        categories[i].bikeVariants = bikeVariants.map(
          (variant) => variant.colorCode
        );
      }
    }

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Categories.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getTotalCategoriesCount = async (req, res) => {
  try {
    const count = await Categories.countDocuments();
    res.json(count);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = new Categories(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateCategory = async (req, res) => {
  // console.log(req.params.id);
  try {
    const category = await Categories.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Categories.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
