import React from 'react';

import TableRow from '../tables/TableRow';
import TableHeader from '../tables/TableHeader';
import CellDappName from '../tables/CellDappName';
import CellDappStatus from '../tables/CellDappStatus';
import CellActions from '../tables/CellActions';

import axios from 'axios';
const uploadEndpoint = 'https://ipfs.dapplist-hackathon.curation.network';
import imgMock from '../blocks/0xuniverse.jpg';

let contract = {
    get_info: function(id) {
        // uint state,
        // bool is_challenged /* many states can be challenged */,
        // bool status_can_be_updated /* if update_status should be called */,
        // bytes ipfs_hash, bytes edit_ipfs_hash /* empty if not editing *
        return [
		1,
		false,
		true,
		'QmS8rfAmZDFnZLUxZveP19as5E9YgVz6wzsw3gZWmaig8R',
		'Qmbznk5jrZ3tyW6dimjJkbp7YW37G6NSeL4qBSoJhpa'];
    },
	list: function() {
		return [1,2,3];
	}
};


class TabRegistry extends React.Component {
  render() {

	let dapps_ids = contract.list();
	let dapps = [];
	let promises = [];
	for (let dapp_id in dapps_ids) {
		let info = contract.get_info(dapp_id);

		dapps.push({
			id: dapp_id,
			state: info[0],
			is_challenged: info[1],
			can_be_updated: info[2],
			current_ipfs_hash: info[3],
			challenged_edit_ipfs_hash: info[4]
		});
	}


	let ipfs_get_results = [];
	Promise.all(dapps.map(dapp => (
		axios.get(uploadEndpoint + '/ipfs/' + dapp['current_ipfs_hash'])
	)))
	.then(results => {
		for (let r in results) {
			try {
				ipfs_get_results.push(results[r].data);
			} catch(err) {
				ipfs_get_results.push({});
			}
		}
		console.log(ipfs_get_results);
	});

    return (<>
      <TableRow type="header">
        <TableHeader type="registry"/>
      </TableRow>
      <TableRow>
        <CellDappName icon={imgMock} name="0xUniverse" desc="Conquering the Universe"/>
        <CellDappStatus type="registry"/>
        <CellActions type="registry"/>
      </TableRow>
      <TableRow>
        <CellDappName icon={imgMock} name="0xUniverse" desc="Conquering the Universe"/>
        <CellDappStatus type="registry" challenges={['update']}/>
        <CellActions type="registry" challenges={['update']}/>
      </TableRow>
      <TableRow>
        <CellDappName icon={imgMock} name="0xUniverse" desc="Conquering the Universe"/>
        <CellDappStatus type="registry" challenges={['remove']}/>
        <CellActions type="registry" challenges={['remove']}/>
      </TableRow>
      <TableRow>
        <CellDappName icon={imgMock} name="0xUniverse" desc="Conquering the Universe"/>
        <CellDappStatus type="registry" challenges={['update', 'remove']}/>
        <CellActions type="registry" challenges={['update', 'remove']}/>
      </TableRow>
    </>);
  }
}

export default TabRegistry;
