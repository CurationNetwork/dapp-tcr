import React from "react";
import { WithContext as ReactTags } from "react-tag-input";

import './TagsWidget.scss';

const KeyCodes = {
  comma: 188,
  enter: 13
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

export default class Tags extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: props.formData ? props.formData.map(e => ({id: e, text: e})) : [],
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(tags) {
    tags = tags.map(e => e.text);
    this.props.onChange(tags);
    console.log(tags);
  }

  handleDelete(i) {
    const { tags } = this.state;
    const newTags = tags.filter((tag, index) => index !== i);
    this.setState({tags: newTags});
    this.onChange(newTags);
  }

  handleAddition(tag) {
    const newTags = [...this.state.tags, tag];
    this.setState({tags: newTags});
    this.onChange(newTags);
  }

  handleDrag(tag, currPos, newPos) {
    const tags = [...this.state.tags];
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags: newTags });
    this.onChange(newTags);
  }

  render() {
    const { tags, suggestions } = this.state;
    
    return (
      <>
        <label className="control-label" htmlFor="">{this.props.schema.title}</label>
        <p className="field-description">
          {this.props.uiSchema['ui:description'] || this.props.schema.description}
        </p>
        <div>
          <ReactTags
            tags={tags}
            suggestions={suggestions}
            handleDelete={this.handleDelete}
            handleAddition={this.handleAddition}
            handleDrag={this.handleDrag}
            delimiters={delimiters}
            placeholder={'Add new'}
            autofocus={false}
          />
        </div>
        <div>
          <ul className="error-detail">
            <li className="text-danger">
              {this.props.errorSchema[0] && this.props.errorSchema[0]['__errors'][0]}
            </li>
          </ul>
        </div>
      </>
    );
  }
}
