// in src/App.js
import * as React from "react";
import { Admin, Resource} from 'react-admin';
import { Route } from 'react-router-dom';
import { PostList, PostEdit, PostCreate } from "./posts";
import Dashboard from "./Dashboard"
import authProvider from './utils/authProvider'
import jsonServerProvider from 'ra-data-json-server';
import RoboticsEnvSelector from "./roboticsEnvs";
import EnvView from "./envMain";
import PostIcon from '@material-ui/icons/Book';

import loginPage from "./login";

// Dummy API para el tutorial de React-Admin
// Se deja por ahora ya que es necesaria una pagina <Resources> para que react-admin funcione
const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');

const App = () => (
    <Admin dashboard={Dashboard} authProvider={authProvider} dataProvider={dataProvider} loginPage={loginPage}
        customRoutes={[
            <Route
                path="/selector"
                component={RoboticsEnvSelector}
            />,
            <Route
                path="/env"
                component={(props) => <EnvView {...props} />}
                noLayout
            />
        ]}
    >
        <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} icon={PostIcon}/>
    </Admin>
);

export default App;
