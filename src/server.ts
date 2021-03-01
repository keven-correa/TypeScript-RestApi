import  express  from "express";
import morgan from 'morgan';
import helmet from 'helmet'
import { send } from "process";
import indexRoutes from "./routes/indexRoutes";
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import postsRoutes from "./routes/postsRoutes";
import userRoutes from "./routes/UserRoutes";


 

class Server{
    public app: express.Application;
    constructor(){
        
        this.app = express();
        this.config();
        this.routes();
    }
    config(){
        const MONGO_URI ='mongodb://localhost/apirest';
        mongoose.set('useFindAndModify', true);
        mongoose.connect(MONGO_URI || process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        }).then(db => console.log('db connected!'));
        //Settings

        this.app.set('port', process.env.PORT || 5000);
        //Middlewares
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(cors());
    }

    routes(){
        this.app.use(indexRoutes);
        this.app.use('/api/posts',postsRoutes);
        this.app.use('/api/users',userRoutes);
    }

    start(){
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();