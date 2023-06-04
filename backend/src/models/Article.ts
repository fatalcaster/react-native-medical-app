import { Schema, model, Document, Model } from "mongoose";
export enum ArticleStatus {
  Published = "published",
  Unpublished = "unpublished",
}
export interface ArticleProps {
  title: string;
  content?: string;
  author: string;
  audioVersion?: { audio: string; hash: string };
  lastAudioHash?: string;
  document?: string;
}

export interface ArticleDoc extends Document {
  id: string;
  hasAudio: boolean;
  bannerImg: string;
  author: string;
  title: string;
  content?: string;
  document?: string;
  summary?: string;
  audio?: { playback: string; hash: string };
  createdAt: Date;
  updatedAt: Date;
  status: ArticleStatus;
}

interface ArticleModel extends Model<ArticleDoc> {
  build(attrs: ArticleProps): ArticleDoc;
}

const articleSchema = new Schema<ArticleDoc>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    bannerImg: {
      type: String,
      required: true,
    },
    hasAudio: {
      type: Boolean,
      required: true,
      default: false,
    },
    summary: {
      type: String,
      required: false,
    },
    // author: {
    // type: Types.ObjectId,
    // ref: "User",
    // },

    document: {
      type: String,
      required: false,
    },
    audio: {
      type: Object,
      required: false,
    },
    status: {
      type: String,
      enum: ArticleStatus,
      required: true,
      // enum: ["user", "admin"],
      default: ArticleStatus.Unpublished,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: {
      transform(_doc: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    toObject: {
      transform(_doc: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

articleSchema.statics.build = (attrs: ArticleProps) => {
  return new Article(attrs);
};

const Article = model<ArticleDoc, ArticleModel>("Article", articleSchema);

export { Article };
