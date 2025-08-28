import React from 'react';
import { TableRow, TableCell, List, ListItem, ListItemText } from '@material-ui/core';

const GroupRow = ({ group }) => (
  <TableRow>
    <TableCell colSpan={5} style={{ backgroundColor: '#fafafa' }}>
      <List dense>
        {group.linkedModels && group.linkedModels.map(m => (
          <ListItem key={m.idModel} style={{ paddingTop: 0, paddingBottom: 0 }}>
            <ListItemText primary={m.modelName} />
          </ListItem>
        ))}
      </List>
    </TableCell>
  </TableRow>
);

export default GroupRow;
