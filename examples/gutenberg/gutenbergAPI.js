export const fetchBooks = async (url) => {
	const booksResult = await fetch(url.href);

	return await booksResult.json();
};
