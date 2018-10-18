import React, {Component} from 'react';

import Aux from '../Auxilliary/Auxilliary';
import Header from '../../components/Header/Header';

class Layout extends Component {
	render () {
		return (
			<Aux>
				<Header />
				{this.props.children}
			</Aux>
		);
	}
}

export default Layout;
	