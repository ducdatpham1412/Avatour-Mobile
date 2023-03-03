import BaseConfig from './config.base';
import ProdConfig from './config.prod';
import DevConfig from './config.dev';
import {ChosenEnv} from './env.chosen';

const ExtraConfig = ChosenEnv === 'dev' ? DevConfig : ProdConfig;

const Config = {...BaseConfig, ...ExtraConfig};

export default Config;
