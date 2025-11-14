import mongoose from "mongoose";

// 🧱 Define content block schema
const ContentBlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["paragraph", "heading", "image", "list", "quote", "code"],
    },
    text: {
      type: String,
      default: null,
    },
    level: {
      type: Number,
      min: 1,
      max: 6,
      default: null,
    },
    items: {
      type: [String],
      default: undefined,
    },
    ordered: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
      default: null,
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { _id: false }
);

ContentBlockSchema.pre("validate", function (next) {
  const b = this;
  if (b.type === "paragraph" && !b.text)
    return next(new Error("Paragraph block must have `text`."));
  if (b.type === "heading" && (!b.text || !b.level))
    return next(new Error("Heading block must have `text` and `level`."));
  if (b.type === "list" && (!Array.isArray(b.items) || b.items.length === 0))
    return next(new Error("List block must have a non-empty `items` array."));
  if (b.type === "image" && !b.url)
    return next(new Error("Image block must have a `url`."));
  next();
});

// 🌐 Define social links schema
const SocialLinkSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, "Social link key is required"],
      trim: true,
      lowercase: true,
      enum: ["linkedin", "instagram", "twitter", "facebook", "github", "youtube", "website"],
    },
    value: {
      type: String,
      required: [true, "Social link value (URL) is required"],
      trim: true,
    },
  },
  { _id: false }
);

// 📰 Blog schema
export const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },
    content: {
      type: [ContentBlockSchema],
      required: [true, "Content is required"],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "Content must be a non-empty array of blocks",
      },
    },
    author: {
      type: String,
      required: [true, "Author is required"],
    },
    tags: {
      type: [String],
      default: [],
    },
    coverImage: {
      type: String,
      default: null,
    },
    published: {
      type: Boolean,
      default: false,
    },
    // 👇 New field: Social links
    socialLinks: {
      type: [SocialLinkSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const BlogModel = mongoose.model("Blog", BlogSchema);
