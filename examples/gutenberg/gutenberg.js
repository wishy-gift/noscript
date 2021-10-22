/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import usePayloadProxy from '@wishy-gift/noscript/dist/hooks/usePayloadProxy';
import Form from '@wishy-gift/noscript/dist/components/Form';

import { fetchBooks } from './gutenbergSlice';

import Nav from './components/Nav';

const getBookFormatUrl = (formats) => {
	let result = formats['text/html'];

	if (result) {
		return result;
	}

	const keys = Object.keys(formats);

	let htmlKey = keys.find(
		(key) =>
			key.indexOf('text/html') === 0 && formats[key].indexOf('.zip') === -1
	);

	if (htmlKey) {
		return formats[htmlKey];
	}

	let plainTextKey = keys.find((key) => key.indexOf('text/plain') === 0);

	if (plainTextKey) {
		return formats[plainTextKey];
	}

	return formats[keys[0]];
};

const yearFormatter = (year) => (year < 0 ? `${year * -1} BCE` : year);

const nameFormatter = (author) => {
	const { name, birth_year, death_year } = author;
	let result = name;

	if (birth_year && death_year) {
		result += ` (${yearFormatter(birth_year)}-${yearFormatter(death_year)})`;
	} else if (yearFormatter(birth_year)) {
		result += ` (${yearFormatter(birth_year)})`;
	} else if (yearFormatter(death_year)) {
		result += ` (${yearFormatter(death_year)})`;
	}

	return result;
};

export default function Gutenberg() {
	const loading = useSelector((state) => state.gutenberg.loading);
	const query = useSelector((state) => state.gutenberg.query);

	const queryUrl = query.url;
	const queryData = query.data;

	const urlSearchParams = useMemo(
		() => (queryUrl ? new URL(queryUrl).searchParams : null),
		[queryUrl]
	);

	const search = urlSearchParams?.get('search') ?? '';
	const page = urlSearchParams?.get('page') ?? '1';
	const count = queryData?.count;
	const totalPages = useMemo(() => {
		if (count) {
			return Math.ceil(count / 32);
		}

		return 0;
	}, [count]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [queryUrl]);

	const payloadProxy = usePayloadProxy();

	return (
		<div
			className={classNames(styles.container, {
				[styles.pending]: loading === 'pending',
			})}
		>
			<header>
				<div className="grid">
					<Form className="searchForm" actionCreator={fetchBooks}>
						<input
							className="searchInput"
							type="search"
							name={payloadProxy.query}
							placeholder="Quick search"
							autoFocus
						/>
						{loading === 'pending' && <span className="spin" />}
					</Form>
				</div>
			</header>

			<main className="main">
				{queryData && (
					<>
						<header className="searchMeta">
							<p className="countLoader">
								<span>{`${count} results${
									search.length ? ` for "${search}"` : ''
								}`}</span>
							</p>
							<Nav
								prevUrl={queryData.previous}
								nextUrl={queryData.next}
								page={page}
								totalPages={totalPages}
							/>
						</header>

						<ul className="results">
							{queryData.results?.map((result) => {
								const {
									id,
									title,
									formats,
									authors,
									translators,
									subjects,
									download_count,
								} = result;

								const image = formats['image/jpeg'];

								const by = authors[0] || translators[0];

								const downloadUrl = getBookFormatUrl(formats);

								return (
									<li key={id}>
										<a
											className="searchResult"
											href={downloadUrl}
											target="_blank"
											rel="noreferrer"
										>
											<div className="imgWrapper">
												{image ? (
													<img className="img" alt="" src={image} />
												) : (
													<span className="noImg" />
												)}
											</div>
											<div>
												<h2 className="bookTitle">{title}</h2>
												{by && <p>{`by ${nameFormatter(by)}`}</p>}
												<p>{`${download_count} download${
													download_count > 1 ? 's' : ''
												} in the last 30 days`}</p>
											</div>
										</a>
									</li>
								);
							})}
						</ul>

						<footer className="footer">
							<Nav
								prevUrl={queryData.previous}
								nextUrl={queryData.next}
								page={page}
								totalPages={totalPages}
							/>
						</footer>
					</>
				)}
			</main>
		</div>
	);
}
