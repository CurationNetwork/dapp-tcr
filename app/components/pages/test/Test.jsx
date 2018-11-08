import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('stores')
@observer
export default class Test extends React.Component {
  componentWillMount() {
    const { list, fetchRegistry } = this.props.stores.tcrStore;

    if (!list.length) {
      fetchRegistry();      
    }
  }

  render() {
    const { list } = this.props.stores.tcrStore;
    console.log('a',list);

    return (
      <div>{JSON.stringify(list)}</div>
    );
  }
}
