import React from 'react';
import { Label } from 'semantic-ui-react';

const InstanceTags = ({ tags }) => {
  return (
    <>
      {tags.map(tag => (
        <Label className="instance__label" key={`${tag.Key}-${tag.Name}`}>
          {tag.Key}: {tag.Value}
        </Label>
      ))}
    </>
  );
};

export default InstanceTags;
