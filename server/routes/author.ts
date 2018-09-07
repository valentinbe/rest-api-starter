import { Router, Request, Response } from "express";
import { AccountModel } from "../models/author";

// UserModel is a regular Mongoose Model with correct types
(async () => {
    const u = new AccountModel({ name: "JohnDoe" });
    await u.save();
    const user = await AccountModel.findOne();
    // prints { _id: 59218f686409d670a97e53e0, name: 'JohnDoe', __v: 0 }
    console.log(user);
  })();

export class AuthorRoutes {

    private router: Router = Router();

    getRouter(): Router {

        /**
         * @swagger
         * /api/author:
         *   get:
         *     tags:
         *      - Author
         *     description:
         *      List of all authors registered in system.
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: Authors
         *       400:
         *         description: Invalid request
         *       403:
         *         description: Forbidden
         */
        this.router.get("/author", async(request: Request, response: Response) => {

            const authors = await AccountModel.find({}).exec();

            response.json(authors)
        });

        /**
         * @swagger
         * /api/author:
         *   post:
         *     tags:
         *      - Author
         *     description:
         *      Create new author.
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: Author
         *       400:
         *         description: Invalid request
         *       403:
         *         description: Forbidden
         */
        this.router.post("/author", async(request: Request, response: Response) => {

            const author = await AccountModel.create(request.body);

            response.status(200).json(author);
        });

        return this.router;
    }
}
