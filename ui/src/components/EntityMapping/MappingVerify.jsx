import React, { Component } from 'react';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import { Button, Card, InputGroup, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import {
  Schema,
} from 'src/components/common';

import './MappingVerify.scss';

const itemRenderer = (item, { handleClick }) => (
  <MenuItem
    style={{ maxWidth: '30vw' }}
    key={item.name}
    text={item.label}
    onClick={handleClick}
  />
);

class MappingVerifyItem extends Component {
  renderLiteralSelect() {
    const { mapping, onPropertyAssign } = this.props;
    const { id, schema, properties } = mapping;

    const items = schema.getEditableProperties()
      .filter(prop => !properties[prop.name])
      .sort((a, b) => (a.label > b.label ? 1 : -1));

    return (
      <Select
        id="entity-select"
        items={items}
        itemRenderer={itemRenderer}
        onItemSelect={(item) => onPropertyAssign(id, item.name, { literal: '' })}
        filterable={false}
        popoverProps={{ minimal: true }}
      >
        <Button
          text="Add a fixed value"
          icon="add"
        />
      </Select>
    );
  }

  renderLiteralEdit(propertyName, value) {
    const { mapping, onPropertyAssign } = this.props;

    return (
      <InputGroup
        id="text-input"
        placeholder="Add a literal value"
        onChange={e => onPropertyAssign(mapping.id, propertyName, { literal: e.target.value })}
        value={value}
        small
      />
    );
  }

  renderPropertyValue(propName, propValue) {
    const { fullMappingsList } = this.props;

    if (!propValue) {
      return null;
    }
    if (propValue.column) {
      return <span className="MappingVerify__listItem__value bp3-monospace-text">{propValue.column}</span>;
    }
    if (propValue.literal) {
      return <span className="MappingVerify__listItem__value">{this.renderLiteralEdit(propName, propValue.literal)}</span>;
    }
    const referredEntity = fullMappingsList.get(propValue);
    return (
      <span className="MappingVerify__listItem__value" style={{ color: referredEntity.color, fontWeight: 'bold' }}>
        <Schema.Smart.Label schema={referredEntity.schema} icon />
      </span>
    );
  }

  render() {
    const { id, schema, color, keys, properties } = this.props.mapping;

    return (
      <Card className="MappingVerify__item" key={id} style={{ borderColor: color }}>
        <h6 className="MappingVerify__title bp3-heading" style={{ color }}>
          <Schema.Smart.Label schema={schema} icon />
        </h6>
        <div className="MappingVerify__section">
          <span className="MappingVerify__section__title">Keys:</span>
          <span className="MappingVerify__section__value bp3-monospace-text">{keys.join(', ')}</span>
        </div>
        <div className="MappingVerify__section">
          <span className="MappingVerify__section__title">Properties:</span>
          <ul className="MappingVerify__list">
            <>
              {Array.from(Object.entries(properties)).map(([propName, propValue]) => (
                <li className="MappingVerify__listItem" key={propName}>
                  <span className="MappingVerify__listItem__label">
                    {schema.getProperty(propName).label}
                    :
                  </span>
                  {this.renderPropertyValue(propName, propValue)}
                </li>
              ))}
            </>
          </ul>

        </div>
        <div className="MappingVerify__section">
          {this.renderLiteralSelect()}
        </div>
      </Card>
    );
  }
}

const MappingVerify = ({ items, fullMappingsList, onPropertyAssign }) => (
  <div className="MappingVerify">
    {items.map((mapping) => (
      <MappingVerifyItem
        fullMappingsList={fullMappingsList}
        mapping={mapping}
        onPropertyAssign={onPropertyAssign}
        key={mapping.id}
      />
    ))}
  </div>
);


export default compose(
  injectIntl,
)(MappingVerify);
