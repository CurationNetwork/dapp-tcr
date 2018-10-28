import React from 'react';

import TableRow from '../tables/TableRow';
import TableHeader from '../tables/TableHeader';
import CellDappName from '../tables/CellDappName';
import CellDappStatus from '../tables/CellDappStatus';
import CellActions from '../tables/CellActions';

import axios from 'axios';
const uploadEndpoint = 'https://ipfs.dapplist-hackathon.curation.network';
import imgMock from '../blocks/0xuniverse.jpg';

import { Contract, afterInit } from '../../helpers/eth';

let contract = {
    get_info: function(id) {
        // uint state,
        // bool is_challenged /* many states can be challenged */,
        // bool status_can_be_updated /* if update_status should be called */,
        // bytes ipfs_hash, bytes edit_ipfs_hash /* empty if not editing *
		if (id == 0) {
        	return [
				1,
				false,
				true,
				'QmS8rfAmZDFnZLUxZveP19as5E9YgVz6wzsw3gZWmaig8R',
				null
			];
		}
		if (id == 1) {
			return [
				1,
				false,
				true,
				'QmdEt1zsm3umViBrx3sQmdRMdEXHqyN6KipG48AT3B25qd',
				null
			];
		}

		if (true) {
			return [
				1,
				false,
				true,
				'Qmf7L4VLuWsAxDQimWrsjsMmxBPc8AF5B8rF6DhvBVTyBx',
				null
			];
		}
    },
	list: function() {
		return [1,2,3];
	}
};


class TabRegistry extends React.Component {
	constructor(props) {
		super(props);

    this.state = {
      list: []
    };

    this.interval = null;
	}

	fetch_data() {
		afterInit.then(() => {
      let contract = Contract('Registry');

      let list = null;

      contract.call('list')
        .then(ids => {
          return Promise.all(ids.map(id => {
            return contract.call('get_info', [id])
          }))
        })
        .then(res => {
          list = res;
          return Promise.all(list.map(item => {
            return axios.get('https://ipfs.io' + '/ipfs/' + Buffer.from(item[3].substr(2), 'hex').toString())
          }))
        })
        .then(res => {
          res.forEach((data, idx) => {
            list[idx].ipfs_data = data;
          });

          this.setState({list: list})
        });
    });
	}

	componentWillMount() {
    this.fetch_data();

		this.interval = setInterval(() => {
			this.fetch_data();
    }, 30 * 1000);
	}

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  render() {
		// let dapps_ids = contract.list();
		// let dapps = [];
		// for (let dapp_id in dapps_ids) {
		// 	let info = contract.get_info(dapp_id);
    //
		// 	dapps.push({
		// 		id: dapp_id,
		// 		state: info[0],
		// 		is_challenged: info[1],
		// 		can_be_updated: info[2],
		// 		current_ipfs_hash: info[3],
		// 		challenged_edit_ipfs_hash: info[4]
		// 	});
		// }

    return (<>
      <TableRow type="header">
        <TableHeader type="registry"/>
      </TableRow>
      {this.state.list.map((item, idx) =>
        <TableRow key={idx}>
          <CellDappName icon={imgMock} name={item.ipfs_data.data.metadata.name} desc={item.ipfs_data.data.metadata.short_description}/>
          <CellDappStatus type="registry"/>
          <CellActions type="registry"/>
        </TableRow>
			)}
    </>);
  }
}

export default TabRegistry;
