import { Container } from "inversify";
import { TYPES } from "./types";
import { Cloud115Service } from "../services/Cloud115Service";
import { QuarkService } from "../services/QuarkService";
import { Searcher } from "../services/Searcher";
import { DatabaseService } from "../services/DatabaseService";

const container = new Container();

// 注册服务
container.bind<Cloud115Service>(TYPES.Cloud115Service).to(Cloud115Service);
container.bind<QuarkService>(TYPES.QuarkService).to(QuarkService);
container.bind<Searcher>(TYPES.Searcher).to(Searcher);
container.bind<DatabaseService>(TYPES.DatabaseService).to(DatabaseService);

export { container };
