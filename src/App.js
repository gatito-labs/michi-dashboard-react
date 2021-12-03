// in src/App.js
import * as React from "react";
import { Admin, Resource, ListGuesser, EditGuesser } from 'react-admin';
import { Route } from 'react-router-dom';
import { UserList } from "./users";
import { PostList, PostEdit, PostCreate } from "./posts";
import Dashboard from "./Dashboard"
import authProvider from './authProvider'
import jsonServerProvider from 'ra-data-json-server';
import FunctionalComponent from "./roboticsEnvs";
import Example from "./spawning";
import ThemedCustomRouteNoLayout from "./customPage";
import IframeEnv from "./iframeEnv"
import PostIcon from '@material-ui/icons/Book';
import UserIcon from '@material-ui/icons/Group';


const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');

const App = () => (
    <Admin dashboard={Dashboard} authProvider={authProvider} dataProvider={dataProvider}
        customRoutes={[
            <Route
                path="/custom"
                component={FunctionalComponent}
            />,
            <Route
                path="/events"
                component={Example}
            />,
            <Route
                path="/env"
                component={(props) => <ThemedCustomRouteNoLayout {...props} />}
                noLayout
            />
        ]}
    >
        <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} icon={PostIcon}/>
        <Resource name="users" create={FunctionalComponent}/>
    </Admin>
);

export default App;
