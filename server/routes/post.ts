import { Request, Response, Router } from "express";
import { PostModel } from "../models/post";
import { AccountModel } from "../models/author";

export class PostRoutes {

  static routes(): Router {

    return Router()
      .get("/post", async (request: Request, response: Response) => {

        const posts = await PostModel.find({}).populate("author").exec();

        response.json(posts)
      })
      .post("/post", async (request: Request, response: Response) => {

        const data = request.body;
        const author = await AccountModel.findOne().exec();

        data.author = author._id;

        const post = await PostModel.create(data);

        response.json(post)
      });
  }
}
