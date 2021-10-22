import { string, number } from 'prop-types';

import Button from '@wishy-gift/noscript/dist/components/Button';

import { fetchBooks } from '../gutenbergSlice';

const Nav = ({ prevUrl, nextUrl, page, totalPages }) => {
	if (!totalPages) {
		return null;
	}

	return (
		<nav className="main">
			<Button
				className="btn"
				actionCreator={fetchBooks}
				disabled={!prevUrl}
				payload={{
					url: prevUrl,
				}}
			>
				Previous page
			</Button>
			<p>
				<strong>{`Page ${page} of ${totalPages}`}</strong>
			</p>
			<Button
				className="btn"
				actionCreator={fetchBooks}
				disabled={!nextUrl}
				payload={{
					url: nextUrl,
				}}
			>
				Next page
			</Button>
		</nav>
	);
};

Nav.propTypes = {
	prevUrl: string,
	nextUrl: string,
	page: string.isRequired,
	totalPages: number,
};

export default Nav;
