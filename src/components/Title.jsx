import React from 'react';
import { Menu, Header } from 'semantic-ui-react';

const Title = () => {
  return (
    <Menu fixed="top" fluid widths={1} inverted>
      <Menu.Item>
        <Header inverted as="h1">
          React EC2 Dashboard
        </Header>
      </Menu.Item>
    </Menu>
  );
};

export default Title;
