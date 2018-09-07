import { json, urlencoded } from "body-parser";
import * as express from "express";
import * as http from "http";
import * as path from "path";

import { AuthorRoutes } from "./routes/author";
import { PostRoutes } from "./routes/post";
import { APIDocsRouter } from "./config/swagger";

const app = express();

app.use(json());
app.use(
  urlencoded({
    extended: true
  })
);

app.get("/", (request: express.Request, response: express.Response) => {
  response.json({
    name: "Express application"
  });
});

app.use(
  (
    err: Error & { status: number },
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): void => {
    response.status(err.status || 500);
    response.json({
      error: "Server error"
    });
  }
);

app.use("/api", PostRoutes.routes());
app.use("/api", new AuthorRoutes().getRouter());
app.use("/api/swagger", new APIDocsRouter().getRouter());
app.use("/docs", express.static(path.join(__dirname, "./assets/swagger")));

const server: http.Server = app.listen(process.env.PORT || 3000);

export { server };
