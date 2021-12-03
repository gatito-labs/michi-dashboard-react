// in src/users.js
import * as React from "react";
import { List, Datagrid, TextField, EmailField, UrlField, EditButton } from 'react-admin';
import MyUrlField from "./myUrlField";

export const UserList = props => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <EmailField source="email" />
            <TextField source="phone" />
            <MyUrlField source="website" />
            <TextField source="company.name" />
            <EditButton />
        </Datagrid>
    </List>
);
